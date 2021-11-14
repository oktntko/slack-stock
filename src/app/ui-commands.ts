// ! user interface
import { cli } from "cli-ux";
import dayjs, { Dayjs } from "dayjs";
import os from "os";
import path from "path";
import { CONTROLLER } from "./middleware-controller";
import {
  enterFirstDate,
  enterKeyword,
  enterLastDate,
  selectAction,
  selectChannels,
  selectContinue,
  searchMessage,
  selectOutputType,
  selectTeam,
} from "./ui-components";
import { color, icon, message, output } from "./ui-helpers";

export const COMMANDS = {
  teams: {
    async add(options: { token?: string } = {}) {
      // token が入力されていない場合、token の取得方法を表示する
      if (!options.token) {
        cli.info("📥 Please setup slack app and copy token");

        cli.info("https://github.com/oktntko/slack-stock#setup-slack-app");
      }

      // Team を登録する
      const team = await addTeam({ token: options.token });

      // 各データを登録する
      await COMMANDS.data.fetch(team);

      cli.info(
        `${icon.done} Finish! Have a great Slack Life with slack-stock! Try to command "${color.info(
          "slst messages stock"
        )}", next "${color.info("slst messages view")}"".`
      );
    },
    async view(options: { output?: OutputType } = {}) {
      const outputType = await selectOutputType(options.output);

      cli.action.start(message.progressing);
      const teams = await CONTROLLER.teams.find();

      if (teams.length > 0) {
        await output(outputType, teams, filePath.teams(outputType));

        cli.action.stop(message.success);
      } else {
        cli.action.stop(message.no_data);
      }
    },
  },
  data: {
    async fetch(options: { team_name?: string } = {}) {
      const team = await selectTeam(options.team_name);

      cli.action.start(message.progressing);
      const [users, channels] = await Promise.all([CONTROLLER.users.fetch(team), CONTROLLER.channels.fetch(team)]);

      if (users.length > 0 && channels.length > 0) {
        cli.action.stop(message.success);
      } else {
        cli.action.stop(message.no_data);
      }
    },
    async view(options: { team_name?: string; output?: OutputType } = {}) {
      const team = await selectTeam(options.team_name);
      const outputType = await selectOutputType(options.output);

      cli.action.start(message.progressing);
      const [users, channels] = await Promise.all([CONTROLLER.users.find(team), CONTROLLER.channels.find(team)]);

      if (users.length > 0 && channels.length > 0) {
        await Promise.all([
          output(outputType, users, filePath.users(outputType)),
          output(outputType, channels, filePath.channels(outputType)),
        ]);

        cli.action.stop(message.success);
      } else {
        cli.action.stop(message.no_data);
      }
    },
  },
  users: {
    async fetch(options: { team_name?: string }) {
      const team = await selectTeam(options.team_name);

      cli.action.start(message.progressing);
      const users = await CONTROLLER.users.fetch(team);

      if (users.length > 0) {
        cli.action.stop(message.success);
      } else {
        cli.action.stop(message.no_data);
      }
    },
    async view(options: { team_name?: string; output?: OutputType }) {
      const team = await selectTeam(options.team_name);
      const outputType = await selectOutputType(options.output);

      cli.action.start(message.progressing);
      const users = await CONTROLLER.users.find(team);

      if (users.length > 0) {
        await output(outputType, users, filePath.users(outputType));

        cli.action.stop(message.success);
      } else {
        cli.action.stop(message.no_data);
      }
    },
  },
  channels: {
    async fetch(options: { team_name?: string }) {
      const team = await selectTeam(options.team_name);

      cli.action.start(message.progressing);
      const channels = await CONTROLLER.channels.fetch(team);

      if (channels.length > 0) {
        cli.action.stop(message.success);
      } else {
        cli.action.stop(message.no_data);
      }
    },
    async view(options: { team_name?: string; output?: OutputType }) {
      const team = await selectTeam(options.team_name);
      const outputType = await selectOutputType(options.output);

      cli.action.start(message.progressing);
      const channels = await CONTROLLER.channels.find(team);

      if (channels.length > 0) {
        await output(outputType, channels, filePath.channels(outputType));

        cli.action.stop(message.success);
      } else {
        cli.action.stop(message.no_data);
      }
    },
  },
  messages: {
    async stock(options: { channel?: string; team_id?: string; oldest?: Dayjs; latest?: Dayjs } = {}) {
      const channels = await selectChannels(options.channel, options.team_id);
      const oldest = await enterFirstDate(options.oldest);
      const latest = await enterLastDate(options.latest);

      cli.action.start(message.progressing);
      const result = (
        await Promise.all(
          channels.map((channel) =>
            CONTROLLER.messages.fetch({
              team_id: channel.team_id,
              token: channel.token,
              channel_id: channel.channel_id,
              oldest,
              latest,
            })
          )
        )
      ).flat();

      if (result.length > 0) {
        cli.action.stop(message.success);
      } else {
        cli.action.stop(message.no_data);
      }
    },
    async view(
      options: { channel?: string; team_id?: string; oldest?: Dayjs; latest?: Dayjs; output?: OutputType } = {}
    ) {
      const channels = await selectChannels(options.channel, options.team_id);
      const oldest = await enterFirstDate(options.oldest);
      const latest = await enterLastDate(options.latest);
      const outputType = await selectOutputType(options.output);

      cli.action.start(message.progressing);
      const messages = (
        await Promise.all(
          channels.map((channel) =>
            CONTROLLER.messages.find({
              channel_id: channel.channel_id,
              oldest,
              latest,
            })
          )
        )
      ).flat();

      if (messages.length > 0) {
        await output(outputType, messages, filePath.messages(oldest, latest, outputType));

        cli.action.stop(message.success);
      } else {
        cli.action.stop(message.no_data);
      }
    },
    async timer(
      options: {
        channel?: string;
        team_id?: string;
        oldest?: Dayjs;
        latest?: Dayjs;
        startKeyword?: string;
        stopKeyword?: string;
        output?: OutputType;
      } = {}
    ) {
      const channels = await selectChannels(options.channel, options.team_id);
      const oldest = await enterFirstDate(options.oldest);
      const latest = await enterLastDate(options.latest);
      const startKeyword = await enterKeyword("Enter start keyword", options.startKeyword);
      const stopKeyword = await enterKeyword("Enter stop  keyword", options.stopKeyword);
      const outputType = await selectOutputType(options.output);

      cli.action.start(message.progressing);
      const messages = (
        await Promise.all(
          channels.map((channel) =>
            CONTROLLER.messages.timer({
              channel_id: channel.channel_id,
              oldest,
              latest,
              startKeyword,
              stopKeyword,
            })
          )
        )
      ).flat();

      if (messages.length > 0) {
        await output(outputType, messages, filePath.messages(oldest, latest, outputType));

        cli.action.stop(message.success);
      } else {
        cli.action.stop(message.no_data);
      }
    },
    async search() {
      const _ = await searchMessage();
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async menu(args: { object?: ObjectType } = {}, options: any = {}) {
    while (true) {
      const action = await selectAction(args.object);

      switch (action) {
        case "teams-add":
          await COMMANDS.teams.add(options);
          break;
        case "teams-view":
          await COMMANDS.teams.view(options);
          break;
        case "data-fetch":
          await COMMANDS.data.fetch(options);
          break;
        case "data-view":
          await COMMANDS.data.view(options);
          break;
        case "messages-stock":
          await COMMANDS.messages.stock(options);
          break;
        case "messages-view":
          await COMMANDS.messages.view(options);
          break;
        case "messages-search":
          await COMMANDS.messages.search();
          break;
        case "messages-timer":
          await COMMANDS.messages.timer(options);
          break;
      }

      if (!(await selectContinue())) {
        cli.info("👋 Bye!");
        break;
      }
    }
  },
};

const addTeam = async (options: { token?: string }) => {
  while (true) {
    const token = await enterKeyword("What is your token?", options.token);

    try {
      const team = await CONTROLLER.teams.add(token);
      return team;
    } catch (e) {
      cli.info(`${icon.error} ${e}`);
    }
  }
};

const filePath = {
  base(fileName: string) {
    return path.join(os.homedir(), fileName);
  },
  teams(outputType: OutputType) {
    return this.base(`@slst_teams_${dayjs().format("YYYY-MM-DD")}.${outputType}`);
  },
  channels(outputType: OutputType) {
    return this.base(`@slst_channels_${dayjs().format("YYYY-MM-DD")}.${outputType}`);
  },
  users(outputType: OutputType) {
    return this.base(`@slst_users_${dayjs().format("YYYY-MM-DD")}.${outputType}`);
  },
  messages(oldest: Dayjs, latest: Dayjs, outputType: OutputType) {
    return this.base(`@slst_messages_${oldest.format("YYYY-MM-DD")}〜${latest.format("YYYY-MM-DD")}.${outputType}`);
  },
};
