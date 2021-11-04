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
      {
        name: "📥 Message stock",
        value: "messages-stock",
      },
      {
        name: "🪟 Message view",
        value: "messages-view",
      },
    ],
    data: [
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
      {
        name: "➕ Team add",
        value: "teams-add",
      },
      {
        name: "➖ Team remove",
        value: "teams-remove",
      },
    ],
  };

  const { selection } = await INTERACTIVE.prompt([
    {
      type: "list",
      name: "selection",
      prefix: icon.question,
      message: "What data do you want to do?",
      choices: object
        ? actions[object]
        : Object.values(actions).reduce((previous, current) => {
            return previous.concat(current);
          }, []),
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
        {
          name: "  Excel",
          value: "xlsx",
        },
      ],
    },
  ]);

  return selection;
};

export const selectTeam = async (input?: string): Promise<Team> => {
  const teams = CONTROLLER.teams.find();

  if (teams.length === 0) {
    throw new Error("please first fetch channel");
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

export const selectChannel = async (input?: string): Promise<Channel & Team> => {
  const channels = CONTROLLER.channels.find();

  if (channels.length === 0) {
    throw new Error("please first fetch channel");
  }

  if (input) {
    const channel = channels.find((channel) => channel.channel_id === input || channel.channel_name === input);

    if (channel) {
      return channel;
    } else {
      cli.info(`${icon.warn} Got invalid channel, please input next`);
    }
  }

  const { channel } = await INTERACTIVE.prompt([
    {
      type: "list",
      name: "channel",
      prefix: icon.question,
      message: "What data do you want to fetch?",
      choices: channels.map((channel) => ({
        name: `${channel.team_name} #${color.bold(channel.channel_name)}`,
        value: channel,
      })),
    },
  ]);

  return channel;
};
