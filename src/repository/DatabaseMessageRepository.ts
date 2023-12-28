import { Prisma } from '@prisma/client';
import { MessageElement } from '@slack/web-api/dist/response/ConversationsHistoryResponse';
import dayjs from 'dayjs';
import { prisma } from '~/middleware/prisma';

export const DatabaseMessageRepository = {
  findManyMessage,
  findUniqueMessage,
  upsertMessage,
  vFindUniqueMessage,
  vCreateMessage,
  vUpdateMessage,
};

async function findManyMessage(
  where?: Prisma.MessageWhereInput,
  orderBy?: Prisma.MessageOrderByWithRelationInput | Prisma.MessageOrderByWithRelationInput[],
  take?: number,
  skip?: number,
) {
  return prisma.message.findMany({
    include: {
      team: true,
      channel: true,
      user: true,
    },
    where,
    orderBy,
    take,
    skip,
  });
}

async function findUniqueMessage(where: Prisma.MessageWhereUniqueInput) {
  return prisma.message.findUnique({
    include: {
      team: true,
    },
    where,
  });
}

async function upsertMessage(message: MessageElement & { team_id: string; channel_id: string }) {
  const result = await prisma.message.upsert({
    create: {
      client_msg_id: message.client_msg_id!,
      team_id: message.team_id,
      channel_id: message.channel_id,
      user_id: message.user!,
      ts: message.ts!,
      date_tz: dayjs.unix(Number(message.ts!)).format('YYYY-MM-DD'),
      time_tz: dayjs.unix(Number(message.ts!)).format('YYYY-MM-DD HH:mm:ss'),
      type: message.type!,
      text: message.text!,
      thread_ts: message.thread_ts,
    },
    update: {
      client_msg_id: message.client_msg_id!,
      team_id: message.team_id,
      channel_id: message.channel_id,
      user_id: message.user!,
      ts: message.ts!,
      date_tz: dayjs.unix(Number(message.ts!)).format('YYYY-MM-DD'),
      time_tz: dayjs.unix(Number(message.ts!)).format('YYYY-MM-DD HH:mm:ss'),
      type: message.type!,
      text: message.text!,
      thread_ts: message.thread_ts,
    },
    where: {
      client_msg_id: message.client_msg_id!,
    },
  });

  // VIRTUAL TABLE にインデックスが貼れないので存在チェックしてからデータ登録
  const text = bigram(result.text);
  if ((await vFindUniqueMessage(result.client_msg_id)).length === 0) {
    await vCreateMessage(result.client_msg_id, text);
  } else {
    await vUpdateMessage(result.client_msg_id, text);
  }

  return result;
}

async function vFindUniqueMessage(client_msg_id: string) {
  return prisma.$queryRaw<{ client_msg_id: string }[]>`
    SELECT
      client_msg_id
    FROM
      v_messages
    WHERE
      client_msg_id = ${client_msg_id}`;
}

async function vCreateMessage(client_msg_id: string, text: string) {
  return prisma.$executeRaw<number>`
    INSERT INTO v_messages (
        client_msg_id
      , text
    ) VALUES (
        ${client_msg_id}
      , ${text}
    )`;
}

async function vUpdateMessage(client_msg_id: string, text: string) {
  return prisma.$executeRaw<number>`
    UPDATE v_messages
    SET text = ${text}
    WHERE
      client_msg_id = ${client_msg_id}`;
}

function bigram(text?: string) {
  if (!text) {
    return '';
  }

  const str = text.replace(/\s+/g, '');
  if (str.length <= 2) {
    return str;
  }

  const grams = [];
  for (let i = 0; i <= str.length - 2; i++) {
    grams.push(str.substring(i, i + 2).toLowerCase());
  }

  return grams.join(' ');
}
