import { MessageElement } from '@slack/web-api/dist/response/ConversationsHistoryResponse';
import { Channel } from '@slack/web-api/dist/response/ConversationsListResponse';
import type { Dayjs } from 'dayjs';
import { slack } from '~/lib/slack';

export const SlackConversationsRepository = {
  list,
  history,
  replies,
};

// https://api.slack.com/methods/conversations.list
async function list(token: string, types = 'public_channel,private_channel') {
  const channels: Channel[] = [];

  for await (const res of slack.paginate('conversations.list', { token, types })) {
    if (res.channels == null) throw new Error('An unexpected error has occurred.');

    channels.push(...(res.channels as Channel[]));
  }

  return channels;
}

// https://api.slack.com/methods/conversations.history
async function history(token: string, channel_id: string, from: Dayjs, to: Dayjs) {
  const messages: MessageElement[] = [];

  for await (const res of slack.paginate('conversations.history', {
    token,
    channel: channel_id,
    oldest: String(from.unix()),
    latest: String(to.unix()),
  })) {
    if (res.messages == null) throw new Error('An unexpected error has occurred.');

    messages.push(...(res.messages as MessageElement[]));
  }

  return messages;
}

// https://api.slack.com/methods/conversations.replies
async function replies(token: string, channel_id: string, ts: string) {
  const messages: MessageElement[] = [];

  for await (const res of slack.paginate('conversations.replies', {
    token,
    channel: channel_id,
    ts,
  })) {
    if (res.messages == null) throw new Error('An unexpected error has occurred.');

    messages.push(...(res.messages as MessageElement[]));
  }

  return messages;
}
