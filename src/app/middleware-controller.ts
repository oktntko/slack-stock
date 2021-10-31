import { Team } from "@prisma/client";
import { Dayjs } from "dayjs";
import { CHAT_CLIENT } from "./data-access-chat";
import { DB_CLIENT } from "./data-access-db";
import { CONVERTER } from "./middleware-converter";

export const CONTROLLER = {
  team: {
    async add(token: string) {
      const res = await CHAT_CLIENT.team.info(token);
      if (res.team == null) throw new Error("An unexpected error has occurred.");

      const team = CONVERTER.team.convert({ ...res.team, token });
      const _ = DB_CLIENT.teams.upsert(team);

      return team;
    },
  },
  teams: {
    find() {
      return DB_CLIENT.teams.findMany();
    },
  },
  users: {
    async fetch(token: string) {
      const res = await CHAT_CLIENT.users.list(token);
      if (res.members == null) throw new Error("An unexpected error has occurred.");

      return res.members
        .map((member) => CONVERTER.user.convert(member))
        .map((member) => DB_CLIENT.users.upsert(member));
    },
    find() {
      return DB_CLIENT.users.findMany();
    },
  },
  channels: {
    async fetch({ team_id, token }: Pick<Team, "team_id" | "token">) {
      const res = await CHAT_CLIENT.conversations.list(token);
      if (res.channels == null) throw new Error("An unexpected error has occurred.");

      return res.channels
        .map((channel) => CONVERTER.channel.convert({ ...channel, team_id }))
        .map((channel) => DB_CLIENT.channels.upsert(channel));
    },
    find() {
      return DB_CLIENT.channels.findMany();
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
        .map((message) => DB_CLIENT.messages.upsert(message));
    },
    find({ channel_id, oldest, latest }: { channel_id: string; oldest: Dayjs; latest: Dayjs }) {
      return DB_CLIENT.messages.findMany({ channel_id, oldest, latest });
    },
  },
};
