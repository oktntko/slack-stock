import { MessageElement } from '@slack/web-api/dist/response/ConversationsHistoryResponse';
import { Channel } from '@slack/web-api/dist/response/ConversationsListResponse';
import type { Dayjs } from 'dayjs';
import { slack } from '~/lib/slack';

export const SlackConversationsRepository = {
  list,
  history,
};

async function list(token: string, types = 'public_channel,private_channel') {
  const channels: Channel[] = [];

  for await (const res of slack.paginate('conversations.list', { token, types })) {
    if (res.channels == null) throw new Error('An unexpected error has occurred.');

    channels.push(...(res.channels as Channel[]));
  }

  return channels;
}

async function history(token: string, channel: string, oldest: Dayjs, latest: Dayjs) {
  const messages: MessageElement[] = [];

  for await (const res of slack.paginate('conversations.history', {
    token,
    channel,
    oldest: String(oldest.unix()),
    latest: String(latest.unix()),
  })) {
    if (res.messages == null) throw new Error('An unexpected error has occurred.');

    messages.push(...(res.messages as MessageElement[]));
  }

  return messages;
}
