import inquirer from "@/wrapper/inquirer";
import ORM from "@/wrapper/ORM";

export const selectMenu = async (): Promise<MenuSelection> => {
  const { menu } = await inquirer.prompt([
    {
      type: "list",
      name: "menu",
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
        new inquirer.Separator("Other"),
        {
          name: "📝 Edit config",
          value: "config",
        },
        {
          name: "📚 Check usage",
          value: "tutorial",
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

  const { selection } = await inquirer.prompt([
    {
      type: "list",
      name: "selection",
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

export const selectOutputType = async (
  input?: OutputType
): Promise<OutputType> => {
  if (input) return input;

  const { selection } = await inquirer.prompt([
    {
      type: "list",
      name: "selection",
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
          name: "{} JSON",
          value: "json",
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

export const selectChannel = async (input?: string): Promise<string> => {
  const channels = await ORM.channel.findMany();

  if (channels == null || channels.length <= 0) {
    throw new Error("please first fetch channel");
  }

  if (input) {
    const channel = channels.find(
      (channel) => channel.channel_id === input || channel.name === input
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
  input?: string
): Promise<Date> => {
  if (input) {
    const date = new Date(input);
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
