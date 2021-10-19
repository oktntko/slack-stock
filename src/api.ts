import {
  convertChannelFromSlackToStock,
  convertMessageFromSlackToStock,
  convertUserFromSlackToStock,
} from "@/converter";
import ORM from "@/wrapper/ORM";
import {
  conversationsHistory,
  conversationsList,
  usersList,
} from "@/wrapper/slack-api";

////////////////////////////////////////////////////
// fetch
////////////////////////////////////////////////////
export const fetchMessages = async (
  token: string,
  channel_id: string,
  oldest: Date,
  latest: Date
) => {
  const { ok, messages } = await conversationsHistory(
    token,
    channel_id,
    oldest,
    latest
  );

  if (!ok || !messages) {
    throw new Error();
  }

  for (const _ of messages) {
    console.log(_);

    const message = convertMessageFromSlackToStock(channel_id, _);

    const foundMessage = await ORM.message.findUnique({
      where: {
        unique_message: {
          channel_id: message.channel_id,
          type: message.type,
          user_id: message.user_id,
          ts: message.ts,
        },
      },
    });
    if (foundMessage) {
      await ORM.message.update({
        where: {
          message_id: foundMessage.message_id,
        },
        data: {
          text: message.text,
        },
      });
    } else {
      await ORM.message.create({
        data: message,
      });
    }
  }
};

export const fetchUsers = async (token: string) => {
  const { ok, members } = await usersList(token);
  if (!ok || !members) {
    throw new Error();
  }

  for (const _ of members) {
    const user = convertUserFromSlackToStock(_);
    await ORM.user.upsert({
      where: { user_id: user.user_id },
      create: user,
      update: user,
    });
  }
};

export const fetchChannels = async (token: string) => {
  const { ok, channels } = await conversationsList(token);
  if (!ok || !channels) {
    throw new Error();
  }

  for (const _ of channels) {
    const channel = convertChannelFromSlackToStock(_);
    await ORM.channel.upsert({
      where: { channel_id: channel.channel_id },
      create: channel,
      update: channel,
    });
  }
};

////////////////////////////////////////////////////
// find
////////////////////////////////////////////////////
export const findMessages = async (
  channel_id: string,
  oldest: Date,
  latest: Date
) =>
  await ORM.message.findMany({
    where: {
      channel_id: channel_id,
      AND: [
        { ts: { gte: String(Math.floor(oldest.getTime() / 1000)) } },
        { ts: { lte: String(Math.floor(latest.getTime() / 1000)) } },
      ],
    },
  });

export const findUsers = async () => await ORM.user.findMany();

export const findChannels = async () => await ORM.channel.findMany();
