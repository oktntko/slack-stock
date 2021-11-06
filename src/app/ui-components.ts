import { Channel, Team } from "@prisma/client";
import { cli } from "cli-ux";
import dayjs, { Dayjs } from "dayjs";
import inquirer from "inquirer";
import { CONTROLLER } from "./middleware-controller";
import { color, icon } from "./ui-helpers";
inquirer.registerPrompt("autocomplete", require("inquirer-autocomplete-prompt"));
// https://intl-date-time-format-checker.pages.dev/
inquirer.registerPrompt("date", require("inquirer-date-prompt"));

const INTERACTIVE = inquirer;

export const inputToken = async (input?: string): Promise<string> => {
  if (input) return input;

  const { token } = await INTERACTIVE.prompt([
    {
      type: "input",
      name: "token",
      prefix: icon.question,
      message: "What is your token?",
    },
  ]);

  return token;
};

export const inputDate = async (input?: Dayjs, message?: string, initialiValue?: Dayjs): Promise<Dayjs> => {
  if (input) {
    if (input.isValid()) {
      return input;
    } else {
      cli.info(`${icon.warn} Got invalid date, please input next`);
    }
  }

  const { selection } = await INTERACTIVE.prompt([
    {
      type: "date",
      name: "selection",
      prefix: icon.question,
      message: message ?? "Select date",
      default: initialiValue ? initialiValue.toDate() : dayjs().toDate(),
      filter: (d: Date) => dayjs(d),
      format: {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        weekday: "narrow",
        timeZoneName: "short",
        hour: undefined,
        minute: undefined,
      },
    },
  ]);

  return selection;
};

export const selectAction = async (object?: ObjectType, input?: ActionType): Promise<ActionType> => {
  const actions = {
    messages: [
      new inquirer.Separator("== 💬 Messages ========================="),
      {
        name: "📥 Message stock",
        value: "messages-stock",
      },
      {
        name: "🪟 Message view",
        value: "messages-view",
      },
      {
        name: "🔍 Message search",
        value: "messages-search",
      },
    ],
    data: [
      new inquirer.Separator("== 💽 Data (👤 Users & 📺 Channels) ===="),
      {
        name: "🔄 Data fetch",
        value: "data-fetch",
      },
      {
        name: "🪟 Data view",
        value: "data-view",
      },
    ],
    teams: [
      new inquirer.Separator("== 👪 Teams ============================"),
      {
        name: "➕ Team add",
        value: "teams-add",
      },
      {
        name: "🪟 Team view",
        value: "teams-view",
      },
    ],
  };

  const choices = object
    ? actions[object]
    : Object.values(actions).reduce((previous, current) => {
        return previous.concat(current);
      }, []);

  const { selection } = await INTERACTIVE.prompt([
    {
      type: "list",
      name: "selection",
      prefix: icon.question,
      message: "What do you want to do?",
      choices: choices,
      pageSize: choices.length,
    },
  ]);

  return selection;
};

export const selectOutputType = async (input?: OutputType): Promise<OutputType> => {
  if (input) return input;

  const { selection } = await INTERACTIVE.prompt([
    {
      type: "list",
      name: "selection",
      prefix: icon.question,
      message: "What output type do you want to do?",
      choices: [
        {
          name: "  Excel",
          value: "xlsx",
        },
        {
          name: "🔲 Console",
          value: "console",
        },
        {
          name: "📁 Csv",
          value: "csv",
        },
        {
          name: "📑 Tsv",
          value: "tsv",
        },
      ],
    },
  ]);

  return selection;
};

export const selectTeam = async (input?: string): Promise<Team> => {
  const teams = await CONTROLLER.teams.find();

  if (teams.length === 0) {
    throw new Error("please first fetch Team");
  }

  if (input) {
    const team = teams.find((team) => team.team_id === input || team.team_name === input);

    if (team) {
      return team;
    } else {
      cli.info(`${icon.warn} Got invalid team, please input next`);
    }
  }

  const { team } = await INTERACTIVE.prompt([
    {
      type: "list",
      name: "team",
      prefix: icon.question,
      message: "Select team",
      choices: teams.map((team) => ({
        name: team.team_name,
        value: team,
      })),
    },
  ]);

  return team;
};

export const selectChannels = async (input?: string, team_id?: string): Promise<(Channel & Team)[]> => {
  const channels = await CONTROLLER.channels.find({ team_id });

  if (channels.length === 0) {
    throw new Error("please first fetch Data");
  }

  if (input) {
    const channel = channels.find((channel) => channel.channel_id === input || channel.channel_name === input);

    if (channel) {
      return [channel];
    } else {
      cli.info(`${icon.warn} Got invalid channel, please input next`);
    }
  }

  const { channel } = await INTERACTIVE.prompt([
    {
      type: "checkbox",
      name: "channel",
      prefix: icon.question,
      message: "Select channel",
      choices: channels.map((channel) => ({
        name: `@${channel.team_name} ${channel.is_private ? "🔒" : "♯ "}${color.bold(channel.channel_name)}`,
        value: channel,
      })),
    },
  ]);

  return channel;
};

export const selectMessage = async (input?: string): Promise<string> => {
  if (input) return input;

  const { message } = await INTERACTIVE.prompt([
    {
      type: "autocomplete",
      name: "keyword",
      message: "Input keyword",
      source(_: any, input: string) {
        return CONTROLLER.messages.search({ text: input });
      },
    },
  ]);

  return message;
};

export const selectContinue = async (): Promise<boolean> => {
  const { confirm } = await INTERACTIVE.prompt([
    {
      type: "confirm",
      name: "confirm",
      prefix: icon.question,
      message: "continue?",
      default: true,
    },
  ]);

  return confirm;
};
