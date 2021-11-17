import { LogLevel, WebClient } from "@slack/web-api";
import { Message } from "@slack/web-api/dist/response/ConversationsHistoryResponse";
import { Member } from "@slack/web-api/dist/response/UsersListResponse";
import { Channel } from "@slack/web-api/dist/response/ConversationsListResponse";
import { Dayjs } from "dayjs";

const client = new WebClient(undefined, {
  logLevel: LogLevel.WARN,
});

export const CHAT_CLIENT = {
  team: {
    async info(token: string) {
      const res = await client.team.info({ token });

      if (res.team == null) throw new Error("An unexpected error has occurred.");

      return res.team;
    },
  },

  conversations: {
    async list(token: string, types = "public_channel,private_channel") {
      const channels: Channel[] = [];

      for await (const res of client.paginate("conversations.list", { token, types })) {
        if (res.channels == null) throw new Error("An unexpected error has occurred.");
        channels.push(...(res.channels as Channel[]));
      }

      return channels;
    },

    async history(token: string, channel: string, oldest: Dayjs, latest: Dayjs) {
      const messages: Message[] = [];

      for await (const res of client.paginate("conversations.history", {
        token,
        channel,
        oldest: String(oldest.unix()),
        latest: String(latest.unix()),
      })) {
        if (res.messages == null) throw new Error("An unexpected error has occurred.");
        messages.push(...(res.messages as Message[]));
      }

      return messages;
    },
  },

  users: {
    async list(token: string) {
      const members: Member[] = [];

      for await (const res of client.paginate("users.list", { token })) {
        if (res.members == null) throw new Error("An unexpected error has occurred.");
        members.push(...(res.members as Member[]));
      }

      return members;
    },
  },
};
