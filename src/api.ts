import {
  convertChannelFromSlackToStock,
  convertMessageFromSlackToStock,
  convertUserFromSlackToStock,
} from "./converter";
import { mapper } from "./db";
import { CHAT } from "./wrapper";

////////////////////////////////////////////////////
// fetch
////////////////////////////////////////////////////
export const fetchMessages = async (
  token: string,
  channel_id: string,
  oldest: Date,
  latest: Date
) => {
  const { ok, messages } = await CHAT.conversationsHistory(
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
  const { ok, members } = await CHAT.usersList(token);
  if (!ok || !members) {
    throw new Error();
  }

  for (const _ of members) {
    const user = convertUserFromSlackToStock(_);
    mapper.user.upsert(user);
  }
};

export const fetchChannels = async (token: string) => {
  const { ok, channels } = await CHAT.conversationsList(token);
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
