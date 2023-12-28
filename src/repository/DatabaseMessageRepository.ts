import { Prisma } from '@prisma/client';
import { MessageElement } from '@slack/web-api/dist/response/ConversationsHistoryResponse';
import dayjs, { type Dayjs } from 'dayjs';
import { prisma } from '~/middleware/prisma';

export const DatabaseMessageRepository = {
  findManyMessage,
  findUniqueMessage,
  upsertMessage,
  vFindUniqueMessage,
  vCreateMessage,
  vUpdateMessage,
  vFindManyMessageByStopwatchKeyword,
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

type MessageStopwatch = {
  team_id: string;
  team_name: string;
  channel_id: string;
  channel_name: string;
  user_id: string;
  user_name: string;
  date_tz: string;
  start_time_tz: string;
  stop_time_tz: string;
  start_text: string;
  stop_text: string;
};
async function vFindManyMessageByStopwatchKeyword(where: {
  channelIdList: string[];
  from: Dayjs;
  to: Dayjs;
  startKeyword: string;
  stopKeyword: string;
}) {
  return prisma.$queryRaw<MessageStopwatch[]>`
      SELECT
          BASE.team_id
        , teams.team_name
        , BASE.channel_id
        , channels.channel_name
        , BASE.user_id
        , users.user_name
        , BASE.date_tz
        , START_KEYWORD.time_tz AS start_time_tz
        , STOP_KEYWORD.time_tz AS stop_time_tz
        , START_KEYWORD.text AS start_text
        , STOP_KEYWORD.text AS stop_text
      FROM
        (
          SELECT
              messages.team_id
            , messages.channel_id
            , messages.user_id
            , messages.date_tz
          FROM
            messages
          WHERE
            1 = 1
            AND messages.channel_id IN (${Prisma.join(where.channelIdList)})
            AND messages.ts BETWEEN ${String(where.from.unix())} AND ${String(where.to.unix())}
          GROUP BY
            messages.team_id
            , messages.channel_id
            , messages.user_id
            , messages.date_tz
        ) AS BASE
        LEFT OUTER JOIN (
          SELECT
              rank
            , messages.team_id
            , messages.channel_id
            , messages.user_id
            , messages.date_tz
            , messages.time_tz
            , messages.text
          FROM
            v_messages
            INNER JOIN messages
              ON v_messages.client_msg_id = messages.client_msg_id
          WHERE
            1 = 1
            AND v_messages.text MATCH ${where.startKeyword}
            AND messages.channel_id IN (${Prisma.join(where.channelIdList)})
            AND messages.ts BETWEEN ${String(where.from.unix())} AND ${String(where.to.unix())}
          GROUP BY
              messages.team_id
            , messages.channel_id
            , messages.user_id
            , messages.date_tz
          ORDER BY
            rank ASC
        ) AS START_KEYWORD
          ON  BASE.team_id     = START_KEYWORD.team_id
          AND BASE.channel_id  = START_KEYWORD.channel_id
          AND BASE.user_id     = START_KEYWORD.user_id
          AND BASE.date_tz     = START_KEYWORD.date_tz
        LEFT OUTER JOIN (
          SELECT
              rank
            , messages.team_id
            , messages.channel_id
            , messages.user_id
            , messages.date_tz
            , messages.time_tz
            , messages.text
          FROM
            v_messages
            INNER JOIN messages
              ON v_messages.client_msg_id = messages.client_msg_id
          WHERE
            1 = 1
            AND v_messages.text MATCH ${where.stopKeyword}
            AND messages.channel_id IN (${Prisma.join(where.channelIdList)})
            AND messages.ts BETWEEN ${String(where.from.unix())} AND ${String(where.to.unix())}
          GROUP BY
              messages.team_id
            , messages.channel_id
            , messages.user_id
            , messages.date_tz
          ORDER BY
            rank ASC
        ) AS STOP_KEYWORD
          ON  BASE.team_id     = STOP_KEYWORD.team_id
          AND BASE.channel_id  = STOP_KEYWORD.channel_id
          AND BASE.user_id     = STOP_KEYWORD.user_id
          AND BASE.date_tz     = STOP_KEYWORD.date_tz
        LEFT OUTER JOIN teams
          ON BASE.team_id = teams.team_id
        LEFT OUTER JOIN channels
          ON BASE.channel_id = channels.channel_id
        LEFT OUTER JOIN users
          ON BASE.user_id = users.user_id
      ORDER BY
          teams.team_name ASC
        , channels.channel_name ASC
        , users.user_name ASC
        , BASE.date_tz ASC
      `;
}
