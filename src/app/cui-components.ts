import { Channel, Team } from "@prisma/client";
import dayjs, { Dayjs } from "dayjs";
import inquirer from "inquirer";
import { CONTROLLER } from "./middleware-controller";
import { COLOR } from "./cui-colors";
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
      prefix: COLOR.success("❓"),
      message: "What is your token?",
    },
  ]);

  return token;
};

export const selectMenu = async (): Promise<MenuSelection> => {
  const { menu } = await INTERACTIVE.prompt([
    {
      type: "list",
      name: "menu",
      prefix: COLOR.success("❓"),
      message: "What do you want to do?",
      choices: [
        {
          name: "🔄 Stock data",
          value: "stock",
        },
        {
          name: "📥 View data",
          value: "view",
        },
        new INTERACTIVE.Separator("Other"),
        {
          name: "📚 Add new workspsace",
          value: "add",
        },
        {
          name: "📞 Contact support",
          value: "contact",
        },
        {
          name: "💨 Exit",
          value: "exit",
        },
      ],
    },
  ]);

  return menu;
};

export const selectDataType = async (input?: DataType): Promise<DataType> => {
  if (input) return input;

  const { selection } = await INTERACTIVE.prompt([
    {
      type: "list",
      name: "selection",
      prefix: COLOR.success("❓"),
      message: "What data do you want to do?",
      choices: [
        {
          name: "💬 Message",
          value: "message",
        },
        {
          name: "👤 User",
          value: "user",
        },
        {
          name: "📺 Channel",
          value: "channel",
        },
      ],
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
      prefix: COLOR.success("❓"),
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
          value: "excel",
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
      console.log("you input invalid channel, please select next list");
    }
  }

  const { team } = await INTERACTIVE.prompt([
    {
      type: "list",
      name: "team",
      prefix: COLOR.success("❓"),
      message: "What data do you want to fetch?",
      choices: teams.map((team) => ({
        name: team.team_name,
        value: team,
      })),
    },
  ]);

  return team;
};

export const selectChannel = async (input?: string): Promise<Channel> => {
  const channels = CONTROLLER.channels.find();

  if (channels.length === 0) {
    throw new Error("please first fetch channel");
  }

  if (input) {
    const channel = channels.find((channel) => channel.channel_id === input || channel.channel_name === input);

    if (channel) {
      return channel;
    } else {
      console.log("you input invalid channel, please select next list");
    }
  }

  const { channel } = await INTERACTIVE.prompt([
    {
      type: "list",
      name: "channel",
      prefix: COLOR.success("❓"),
      message: "What data do you want to fetch?",
      choices: channels.map((channel) => ({
        name: channel.channel_name,
        value: channel,
      })),
    },
  ]);

  return channel;
};

export const selectDate = async (input?: Dayjs, message?: string, initialiValue?: Dayjs): Promise<Dayjs> => {
  if (input) {
    if (input.isValid()) {
      return input;
    } else {
      console.log("you input invalid date, please input next");
    }
  }

  const { selection } = await INTERACTIVE.prompt([
    {
      type: "date",
      name: "selection",
      prefix: COLOR.success("❓"),
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
