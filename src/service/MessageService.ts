import { Message, Prisma } from '@prisma/client';
import { type Dayjs } from 'dayjs';
import { DatabaseMessageRepository } from '~/repository/DatabaseMessageRepository';
import { SlackConversationsRepository } from '~/repository/SlackConversationsRepository';

export const MessageService = {
  fetchMessage,
  listMessage,
  listMessageByStopwatchKeyword,
};

async function fetchMessage(
  team_id: string,
  token: string,
  channel_id: string,
  from: Dayjs,
  to: Dayjs,
) {
  const messageList = await SlackConversationsRepository.history(token, channel_id, from, to);

  const result: Message[] = [];
  for (const message of messageList) {
    result.push(await DatabaseMessageRepository.upsertMessage({ ...message, team_id, channel_id }));
  }

  // スレッド内のメッセージは .history で取得できないので、別途取得する
  // thread_ts プロパティがある message がスレッドルート（or チャンネルにも投稿されたスレッドメッセージ）
  const threadTsSet = new Set(
    messageList.filter((message) => message.thread_ts).map((message) => message.thread_ts!),
  );
  for (const thread_ts of threadTsSet.values()) {
    const messageList = await SlackConversationsRepository.replies(token, channel_id, thread_ts);

    for (const message of messageList) {
      result.push(
        await DatabaseMessageRepository.upsertMessage({ ...message, team_id, channel_id }),
      );
    }
  }

  return result;
}

async function listMessage(
  where: Prisma.MessageWhereInput,
  orderBy: Prisma.MessageOrderByWithRelationInput | Prisma.MessageOrderByWithRelationInput[],
  take?: number,
  skip?: number,
) {
  return DatabaseMessageRepository.findManyMessage(where, orderBy, take, skip);
}

async function listMessageByStopwatchKeyword(where: {
  channelIdList: string[];
  from: Dayjs;
  to: Dayjs;
  startKeyword: string;
  stopKeyword: string;
}) {
  return DatabaseMessageRepository.vFindManyMessageByStopwatchKeyword(where);
}
