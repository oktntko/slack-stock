import { Team } from "@prisma/client";
import { Dayjs } from "dayjs";
import { CHAT_CLIENT } from "./dataaccess-chat";
import { DB_CLIENT } from "./dataaccess-db";
import { decrypt, encrypt } from "./dataaccess-password";
import { CONVERTER } from "./middleware-converter";
import { color } from "./ui-helpers";

export const CONTROLLER = {
  teams: {
    async add(token: string) {
      const res = await CHAT_CLIENT.team.info(token);
      if (res.team == null) throw new Error("An unexpected error has occurred.");

      const team = CONVERTER.team.convert({ ...res.team, token });
      const _ = DB_CLIENT.teams.upsert({ ...team, token: encrypt(token) });

      return team;
    },
    async find() {
      return DB_CLIENT.teams.findMany().map((team) => {
        team.token = decrypt(team.token);
        return team;
      });
    },
  },
  users: {
    async fetch({ token }: { token: string }) {
      const res = await CHAT_CLIENT.users.list(token);
      if (res.members == null) throw new Error("An unexpected error has occurred.");

      return res.members
        .map((member) => CONVERTER.user.convert(member))
        .map((member) => DB_CLIENT.users.upsert(member))
        .reduce((previous, current) => previous + current.changes, 0);
    },
    async find(params: { team_id?: string } = {}) {
      return DB_CLIENT.users.findMany(params);
    },
  },
  channels: {
    async fetch({ team_id, token }: Pick<Team, "team_id" | "token">) {
      const res = await CHAT_CLIENT.conversations.list(token);
      if (res.channels == null) throw new Error("An unexpected error has occurred.");

      return res.channels
        .map((channel) => CONVERTER.channel.convert({ ...channel, team_id }))
        .map((channel) => DB_CLIENT.channels.upsert(channel))
        .reduce((previous, current) => previous + current.changes, 0);
    },
    async find(params: { team_id?: string } = {}) {
      return DB_CLIENT.channels.findMany(params).map((channel) => {
        channel.token = decrypt(channel.token);
        return channel;
      });
    },
  },
  messages: {
    async fetch({
      team_id,
      token,
      channel_id,
      oldest,
      latest,
    }: Pick<Team, "team_id" | "token"> & { channel_id: string; oldest: Dayjs; latest: Dayjs }) {
      const res = await CHAT_CLIENT.conversations.history(token, channel_id, oldest, latest);
      if (res.messages == null) throw new Error("An unexpected error has occurred.");

      return res.messages
        .map((message) => CONVERTER.message.convert({ ...message, team_id, channel_id }))
        .map((message) => {
          const result = DB_CLIENT.messages.upsert(message);
          if (!result) return null;

          // VIRTUAL TABLE にインデックスが貼れないので存在チェックしてからデータ登録
          const text = bigram(result.text);
          const found = DB_CLIENT.messages.vFindUnique(result);
          if (found?.message_id) {
            DB_CLIENT.messages.vUpdate({ message_id: result.message_id, text });
          } else {
            DB_CLIENT.messages.vInsert({ message_id: result.message_id, text });
          }

          return result;
        })
        .filter((message) => message != null);
    },
    async find(params: { channel_id: string; oldest: Dayjs; latest: Dayjs }) {
      return DB_CLIENT.messages.findMany(params);
    },
    async search(params: { text?: string }) {
      const text = bigram(params.text);
      if (text) {
        return DB_CLIENT.messages.vFindMany({ text }).map((message) => ({
          name: `${message.team_name} ${message.channel_name} ${color.bold(message.text)}`,
          value: message,
        }));
      } else {
        return [];
      }
    },
  },
};

const bigram = (text?: string) => {
  if (!text) {
    return "";
  }

  const str = text.replace(/\s+/g, "");
  if (str.length <= 2) {
    return str;
  }

  const grams = [];
  for (let i = 0; i <= str.length - 2; i++) {
    grams.push(str.substr(i, 2).toLowerCase());
  }

  return grams.join(" ");
};
