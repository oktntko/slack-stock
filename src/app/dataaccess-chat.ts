import { LogLevel, WebClient } from "@slack/web-api";
import { Dayjs } from "dayjs";

const client = new WebClient(undefined, {
  logLevel: LogLevel.WARN,
});

export const CHAT_CLIENT = {
  team: {
    info(token: string) {
      return client.team.info({
        token,
      });
    },
  },

  conversations: {
    list(token: string, types?: "public_channel" | "private_channel" | "mpim" | "im", limit?: number, cursor?: string) {
      return client.conversations.list({
        token,
        types,
        limit,
        cursor,
      });
    },
    history(token: string, channel: string, oldest: Dayjs, latest: Dayjs) {
      return client.conversations.history({
        token,
        channel,
        oldest: String(oldest.unix()),
        latest: String(latest.unix()),
      });
    },
  },

  users: {
    list(token: string, limit?: number, cursor?: string) {
      return client.users.list({
        token,
        limit,
        cursor,
      });
    },
  },
};
