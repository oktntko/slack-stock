// ! user interface
import { cli } from "cli-ux";
import dayjs, { Dayjs } from "dayjs";
import os from "os";
import path from "path";
import { CONTROLLER } from "./middleware-controller";
import {
  inputDate,
  inputToken,
  selectAction,
  selectChannel,
  selectContinue,
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
        await output(outputType, teams, filePath(`teams_${dayjs().format("YYYY-MM-DD")}.${outputType}`));

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
      const result = (await CONTROLLER.users.fetch(team)) + (await CONTROLLER.channels.fetch(team));

      if (result > 0) {
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
          output(outputType, users, filePath(`@${team.team_name}_users_${dayjs().format("YYYY-MM-DD")}.${outputType}`)),
          output(
            outputType,
            channels,
            filePath(`@${team.team_name}_channels_${dayjs().format("YYYY-MM-DD")}.${outputType}`)
          ),
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
      const result = await CONTROLLER.users.fetch(team);

      if (result > 0) {
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
        await output(
          outputType,
          users,
          filePath(`@${team.team_name}_users_${dayjs().format("YYYY-MM-DD")}.${outputType}`)
        );

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
      const result = await CONTROLLER.channels.fetch(team);

      if (result > 0) {
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
        await output(
          outputType,
          channels,
          filePath(`@${team.team_name}_channels_${dayjs().format("YYYY-MM-DD")}.${outputType}`)
        );

        cli.action.stop(message.success);
      } else {
        cli.action.stop(message.no_data);
      }
    },
  },
  messages: {
    async stock(options: { channel?: string; team_id?: string; oldest?: Dayjs; latest?: Dayjs } = {}) {
      const channel = await selectChannel(options.channel, options.team_id);
      const oldest = await inputDate(options.oldest, "Select start date", dayjs().subtract(1, "day").startOf("day"));
      const latest = await inputDate(options.latest, "Select end   date", dayjs().endOf("day") /* today */);

      cli.action.start(message.progressing);
      const result = await CONTROLLER.messages.fetch({
        team_id: channel.team_id,
        token: channel.token,
        channel_id: channel.channel_id,
        oldest,
        latest,
      });

      if (result > 0) {
        cli.action.stop(message.success);
      } else {
        cli.action.stop(message.no_data);
      }
    },
    async view(
      options: { channel?: string; team_id?: string; oldest?: Dayjs; latest?: Dayjs; output?: OutputType } = {}
    ) {
      const channel = await selectChannel(options.channel, options.team_id);
      const oldest = await inputDate(options.oldest, "Select start date", dayjs().subtract(1, "day").startOf("day"));
      const latest = await inputDate(options.latest, "Select end   date", dayjs().endOf("day") /* today */);
      const outputType = await selectOutputType(options.output);

      cli.action.start(message.progressing);
      const messages = await CONTROLLER.messages.find({
        channel_id: channel.channel_id,
        oldest,
        latest,
      });

      if (messages.length > 0) {
        await output(
          outputType,
          messages,
          filePath(
            `@${channel.team_name}_#${channel.channel_name}_messages_${oldest.format("YYYY-MM-DD")}〜${latest.format(
              "YYYY-MM-DD"
            )}.${outputType}`
          )
        );

        cli.action.stop(message.success);
      } else {
        cli.action.stop(message.no_data);
      }
    },
  },
  async menu(args: { object?: ObjectType; action?: ActionType } = {}, options: any = {}) {
    while (true) {
      const action = await selectAction(args.object, args.action);

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
    const token = await inputToken(options.token);

    try {
      const team = await CONTROLLER.teams.add(token);
      return team;
    } catch (e) {
      cli.info(`${icon.error} ${e}`);
    }
  }
};

const filePath = (fileName: string) => path.join(os.homedir(), fileName);
