import { LogLevel, WebClient } from "@slack/web-api";
import {
  convertChannelFromSlackToStock,
  convertMessageFromSlackToStock,
  convertUserFromSlackToStock,
} from "./converter";
import { mapper } from "./db";

////////////////////////////////////////////////////
// client
////////////////////////////////////////////////////
const client = new WebClient(undefined, {
  logLevel: LogLevel.DEBUG,
});

const CHAT = {
  conversations: {
    list(
      token: string,
      exclude_archived?: boolean,
      types?: "public_channel" | "private_channel" | "mpim" | "im",
      team_id?: string,
      limit?: number,
      cursor?: string
    ) {
      return client.conversations.list({
        token,
        cursor,
        exclude_archived,
        limit,
        team_id,
        types,
      });
    },
    history(
      token: string,
      channel: string,
      oldest: Date,
      latest: Date,
      inclusive?: boolean,
      limit?: number,
      cursor?: string
    ) {
      return client.conversations.history({
        token,
        channel,
        cursor,
        inclusive,
        limit,
        latest: String(Math.floor(latest.getTime() / 1000)),
        oldest: String(Math.floor(oldest.getTime() / 1000)),
      });
    },
  },

  users: {
    list(
      token: string,
      team_id?: string,
      include_locale?: boolean,
      limit?: number,
      cursor?: string
    ) {
      return client.users.list({
        token,
        cursor,
        include_locale,
        limit,
        team_id,
      });
    },
  },
};

////////////////////////////////////////////////////
// fetch
////////////////////////////////////////////////////
export const fetchMessages = async (
  token: string,
  channel_id: string,
  oldest: Date,
  latest: Date
) => {
  const { ok, messages } = await CHAT.conversations.history(
    token,
    channel_id,
    oldest,
    latest
  );

  if (!ok || !messages) {
    throw new Error();
  }

  for (const _ of messages) {
    const message = convertMessageFromSlackToStock(channel_id, _);
    mapper.message.upsert(message);
  }
};

export const fetchUsers = async (token: string) => {
  const { ok, members } = await CHAT.users.list(token);
  if (!ok || !members) {
    throw new Error();
  }

  for (const _ of members) {
    const user = convertUserFromSlackToStock(_);
    mapper.user.upsert(user);
  }
};

export const fetchChannels = async (token: string) => {
  const { ok, channels } = await CHAT.conversations.list(token);
  if (!ok || !channels) {
    throw new Error();
  }

  for (const _ of channels) {
    const channel = convertChannelFromSlackToStock(_);
    mapper.channel.upsert(channel);
  }
};

////////////////////////////////////////////////////
// find
////////////////////////////////////////////////////
export const findMessages = async (
  channel_id: string,
  oldest: Date,
  latest: Date
) => mapper.message.findMany(channel_id, oldest, latest);

export const findUsers = async () => mapper.user.findMany();

export const findChannels = async () => mapper.channel.findMany();
