import {
  createDefaultConfigFile,
  isExistsConfigFile,
  loadConfig,
  saveConfig,
} from "@/config";
import inquirer from "@/wrapper/inquirer";
import ORM from "@/wrapper/ORM";

export const selectMenu = async () => {
  const { want } = await inquirer.prompt([
    {
      type: "list",
      name: "want",
      message: "What do you want to do?",
      choices: [
        {
          name: "🔄Fetch data",
          value: "Fetch data",
        },
        {
          name: "📥Export data",
          value: "Export data",
        },
        new inquirer.Separator("Other"),
        {
          name: "📝Edit config",
          value: "Edit config",
        },
        {
          name: "📚Check usage",
          value: "Check usage",
        },
        {
          name: "📞Contact support",
          value: "Contact support",
        },
        {
          name: "💨Exit",
          value: "Exit",
        },
      ],
    },
  ]);

  return want;
};

export const selectFetchData = async (
  data?: FetchSelection
): Promise<FetchSelection> => {
  if (data) return data;

  const { selection } = await inquirer.prompt([
    {
      type: "list",
      name: "selection",
      message: "What data do you want to fetch?",
      choices: [
        {
          name: "💬Fetch message",
          value: "message",
        },
        {
          name: "👤Fetch user",
          value: "user",
        },
        {
          name: "📺Fetch channel",
          value: "channel",
        },
      ],
    },
  ]);

  return selection;
};

export const selectChannel = async (channelInput?: string): Promise<string> => {
  const channels = await ORM.channel.findMany();

  if (channels == null || channels.length <= 0) {
    throw new Error("please first fetch channel");
  }

  if (channelInput) {
    const channel = channels.find(
      (channel) =>
        channel.channel_id === channelInput || channel.name === channelInput
    );
    if (channel) {
      return channel.channel_id;
    } else {
      console.log("you input invalid channel, please select next list");
    }
  }

  const { channel_id } = await inquirer.prompt([
    {
      type: "list",
      name: "channel_id",
      message: "What data do you want to fetch?",
      choices: channels.map((channel) => ({
        name: channel.name,
        value: channel.channel_id,
      })),
    },
  ]);

  return channel_id;
};

export const selectDate = async (
  message: string,
  dateInput?: string
): Promise<Date> => {
  if (dateInput) {
    const date = new Date(dateInput);
    if (!Number.isNaN(date.getTime())) {
      return new Date(date.setHours(0, 0, 0, 0));
    } else {
      console.log("you input invalid date, please input next");
    }
  }

  const { selection } = await inquirer.prompt([
    {
      type: "date",
      name: "selection",
      message: message,
      filter: (d: Date) => new Date(d.setHours(0, 0, 0, 0)),
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

export const editConfig = async () => {
  if (!isExistsConfigFile()) {
    createDefaultConfigFile();
    console.log("Created default config file.");
  }

  while (true) {
    const config = loadConfig();

    const { editMenu } = await inquirer.prompt([
      {
        type: "list",
        name: "editMenu",
        message: "What do you want to edit?",
        choices: ["default", "slack config"],
      },
    ]);

    if (editMenu === "default") {
      const { slackName } = await inquirer.prompt([
        {
          type: "list",
          name: "slackName",
          message: "Select default slack name.",
          choices: Object.keys(config.slack_config),
        },
      ]);

      config.default = slackName;
    } else if (editMenu === "slack config") {
      const { slackName, token } = await inquirer.prompt([
        {
          type: "list",
          name: "slackName",
          message: "Select edit token slack name.",
          choices: Object.keys(config.slack_config),
        },
        {
          type: "input",
          name: "token",
          message: "Input slack token.",
        },
      ]);

      config.slack_config[slackName].token = token;
    }

    saveConfig(config);

    const { isContinue } = await inquirer.prompt([
      {
        type: "confirm",
        name: "isContinue",
        message: "Continue edit config?",
        default: false,
      },
    ]);

    if (!isContinue) break;
  }
};
