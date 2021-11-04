// ! user interface
import { cli } from "cli-ux";
import dayjs, { Dayjs } from "dayjs";
import os from "os";
import path from "path";
import { CONTROLLER } from "./middleware-controller";
import { inputDate, inputToken, selectAction, selectChannel, selectOutputType, selectTeam } from "./ui-components";
import { icon, output } from "./ui-helpers";

/**
 * * slst t|teams    add    --token=TOKEN
 * * slst t|teams    remove --token=TEAM|TOKEN
 *
 * * slst d|data     fetch --team=TEAM
 * * slst d|data     view  --team=TEAM --csv
 * * slst u|users    fetch --team=TEAM
 * * slst u|users    view  --team=TEAM --csv
 * * slst c|channels fetch --team=TEAM
 * * slst c|channels view  --team=TEAM --csv
 *
 * * slst m|messages stock --channel=CHANNEL --period=FROM TO
 * * slst m|messages view  --channel=CHANNEL --period=FROM TO
 */
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
      cli.action.start(`${icon.info} Start fetch user data`);
      await CONTROLLER.users.fetch(team);
      cli.action.stop(icon.success);

      cli.action.start(`${icon.info} Start fetch channel data`);
      await CONTROLLER.channels.fetch(team);
      cli.action.stop(icon.success);

      cli.info(`${icon.info} Select channel you want to stock message data`);
      await COMMANDS.messages.stock();
      cli.info(`${icon.success} Stocked all data.`);

      // データを出力する
      cli.info(`${icon.tips} You can view data, please select data you want to view.`);
      await COMMANDS.messages.view();

      cli.info(`${icon.done} Finish! Have a great Slack Life with slack-stock!`);
    },
    async remove(options: { token?: string } = {}) {},
  },
  data: {
    async fetch(options: { team?: string } = {}) {
      const team = await selectTeam(options.team);

      await CONTROLLER.users.fetch(team);
      await CONTROLLER.channels.fetch(team);

      cli.info(`${icon.success} Success!`);
    },
    async view(options: { team?: string; output?: OutputType } = {}) {
      const team = await selectTeam(options.team);
      const outputType = await selectOutputType(options.output);

      const users = await CONTROLLER.users.find(team);
      const channels = await CONTROLLER.channels.find(team);
      await output(
        outputType,
        users,
        filePath(`@${team.team_name}_users_${dayjs().format("YYYY-MM-DD")}.${outputType}`)
      );
      await output(
        outputType,
        channels,
        filePath(`@${team.team_name}_channels_${dayjs().format("YYYY-MM-DD")}.${outputType}`)
      );

      cli.info(`${icon.success} Success!`);
    },
  },
  users: {
    async fetch(options: { team_name?: string }) {
      const team = await selectTeam(options.team_name);

      await CONTROLLER.users.fetch(team);

      cli.info(`${icon.success} Success!`);
    },
    async view(options: { team_name?: string; output?: OutputType }) {
      const team = await selectTeam(options.team_name);
      const outputType = await selectOutputType(options.output);

      const users = await CONTROLLER.users.find(team);
      await output(
        outputType,
        users,
        filePath(`@${team.team_name}_users_${dayjs().format("YYYY-MM-DD")}.${outputType}`)
      );

      cli.info(`${icon.success} Success!`);
    },
  },
  channels: {
    async fetch(options: { team_name?: string }) {
      const team = await selectTeam(options.team_name);

      await CONTROLLER.channels.fetch(team);

      cli.info(`${icon.success} Success!`);
    },
    async view(options: { team_name?: string; output?: OutputType }) {
      const team = await selectTeam(options.team_name);
      const outputType = await selectOutputType(options.output);

      const channels = await CONTROLLER.channels.find(team);
      await output(
        outputType,
        channels,
        filePath(`@${team.team_name}_channels_${dayjs().format("YYYY-MM-DD")}.${outputType}`)
      );

      cli.info(`${icon.success} Success!`);
    },
  },
  messages: {
    async stock(options: { channel?: string; oldest?: Dayjs; latest?: Dayjs } = {}) {
      const channel = await selectChannel(options.channel);
      const oldest = await inputDate(options.oldest, "Select start date", dayjs().subtract(1, "day").startOf("day"));
      const latest = await inputDate(options.latest, "Select end date  ", dayjs().endOf("day") /* today */);

      await CONTROLLER.messages.fetch({
        team_id: channel.team_id,
        token: channel.token,
        channel_id: channel.channel_id,
        oldest,
        latest,
      });

      cli.info(`${icon.success} Success!`);
    },
    async view(options: { channel?: string; oldest?: Dayjs; latest?: Dayjs; output?: OutputType } = {}) {
      const channel = await selectChannel(options.channel);
      const oldest = await inputDate(options.oldest, "Select start date", dayjs().subtract(1, "day").startOf("day"));
      const latest = await inputDate(options.latest, "Select end date  ", dayjs().endOf("day") /* today */);
      const outputType = await selectOutputType(options.output);

      const messages = await CONTROLLER.messages.find({
        channel_id: channel.channel_id,
        oldest,
        latest,
      });
      await output(
        outputType,
        messages,
        filePath(
          `@${channel.team_name}_#${channel.channel_name}_messages_${oldest.format("YYYY-MM-DD")}〜${latest.format(
            "YYYY-MM-DD"
          )}.${outputType}`
        )
      );

      cli.info(`${icon.success} Success!`);
    },
  },
  async menu(args: { object?: ObjectType; action?: ActionType } = {}, options: any = {}) {
    while (true) {
      const action = await selectAction(args.object, args.action);

      switch (action) {
        case "teams-add":
          await COMMANDS.teams.add(options);
          break;
        case "teams-remove":
          await COMMANDS.teams.remove(options);
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

      await cli.anykey();
    }
  },
};

const addTeam = async (options: { token?: string }) => {
  while (true) {
    const token = await inputToken(options.token);

    try {
      const team = await CONTROLLER.team.add(token);
      return team;
    } catch (e) {
      cli.info(`${icon.error} ${e}`);
    }
  }
};

const filePath = (fileName: string) => path.join(os.homedir(), fileName);
