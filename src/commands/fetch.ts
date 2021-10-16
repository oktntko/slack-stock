import { loadSlackConfig } from "@/config";
import {
  convertChannelFromSlackToStock,
  convertMessageFromSlackToStock,
  convertUserFromSlackToStock,
} from "@/converter";
import { selectChannel, selectFetchData } from "@/interactive";
import ORM from "@/wrapper/ORM";
import {
  conversationsHistory,
  conversationsList,
  usersList,
} from "@/wrapper/slack-api";
import { Command, flags } from "@oclif/command";

export default class Fetch extends Command {
  static description = "describe the command here";

  static flags = {
    help: flags.help({ char: "h" }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({
      char: "n",
      description: "slack name from config file",
    }),
    channel: flags.string({
      char: "c",
      description: "if fetch message data, set channel id",
    }),
  };

  static args = [
    {
      name: "data",
      description: "select fetch data",
      required: false,
      hidden: false,
      options: ["message", "user", "channel"],
    },
  ];

  async run() {
    const { args, flags } = this.parse(Fetch);

    await fetch(args.data, flags.name, flags.channel);
  }
}

const fetch = async (
  data?: FetchSelection,
  name?: string,
  channel?: string
) => {
  const selection = await selectFetchData(data);

  const config = loadSlackConfig(name);

  switch (selection) {
    case "message":
      const channel_id = await selectChannel(channel);
      await fetchMessages(config.token, channel_id);
      return;
    case "user":
      await fetchUsers(config.token);
      return;
    case "channel":
      await fetchChannels(config.token);
      return;
  }
};

const fetchMessages = async (token: string, channel_id: string) => {
  const { ok, messages } = await conversationsHistory(token, channel_id);
  if (!ok || !messages) {
    throw new Error();
  }

  for (const _ of messages) {
    console.log(_);
    const message = convertMessageFromSlackToStock(channel_id, _);
    const foundMessage = await ORM.message.findUnique({
      where: {
        unique_message: {
          channel_id: message.channel_id,
          type: message.type,
          user_id: message.user_id,
          ts: message.ts,
        },
      },
    });
    if (foundMessage) {
      await ORM.message.update({
        where: {
          message_id: foundMessage.message_id,
        },
        data: {
          text: message.text,
        },
      });
    } else {
      await ORM.message.create({
        data: message,
      });
    }
  }
};

const fetchChannels = async (token: string) => {
  const { ok, channels } = await conversationsList(token);
  if (!ok || !channels) {
    throw new Error();
  }

  for (const _ of channels) {
    const channel = convertChannelFromSlackToStock(_);
    await ORM.channel.upsert({
      where: { channel_id: channel.channel_id },
      create: channel,
      update: channel,
    });
  }
};

export const fetchUsers = async (token: string) => {
  const { ok, members } = await usersList(token);
  if (!ok || !members) {
    throw new Error();
  }

  for (const _ of members) {
    const user = convertUserFromSlackToStock(_);
    await ORM.user.upsert({
      where: { user_id: user.user_id },
      create: user,
      update: user,
    });
  }
};
