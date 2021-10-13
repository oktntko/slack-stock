import {
  createDefaultConfigFile,
  isExistsConfigFile,
  loadConfig,
  loadSlackConfig,
  saveConfig,
} from "@/config";
import ORM from "@/wrapper/ORM";
import {
  conversationsHistory,
  conversationsList,
  convertToConversation,
  convertToMessage,
  convertToUser,
  usersList,
} from "@/wrapper/slack-api";
import inquirer from "inquirer";

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

  if (want == "Fetch data") {
    fetchData();
  }
};

export const fetchData = async (
  type?: "user" | "channel" | "message",
  slackName?: string,
  _channel_id?: string
) => {
  if (!type) {
    const { data } = await inquirer.prompt([
      {
        type: "list",
        name: "data",
        message: "What data do you want to fetch?",
        choices: [
          {
            name: "💬Fetch message data",
            value: "message",
          },
          {
            name: "👤Fetch user data",
            value: "user",
          },
          {
            name: "📺Fetch channel data",
            value: "channel",
          },
        ],
      },
    ]);
    type = data;
  }

  if (type == "user") {
    fetchUsers(slackName);
  } else if (type == "channel") {
    fetchConversations(slackName);
  } else {
    if (!_channel_id) {
      const { channel_id } = await inquirer.prompt([
        {
          type: "list",
          name: "channel_id",
          message: "What data do you want to fetch?",
          choices: (
            await ORM.conversation.findMany()
          ).map((channel) => ({
            name: channel.name,
            value: channel.conversation_id,
          })),
        },
      ]);
      _channel_id = channel_id;
    }
    fetchMessages(_channel_id!, slackName);
  }
};

export const fetchConversations = async (slackName?: string) => {
  const config = loadSlackConfig(slackName);

  const conversationsListResponse = await conversationsList(config.token);
  if (!conversationsListResponse.ok || !conversationsListResponse.channels) {
    throw new Error();
  }

  const { channels } = conversationsListResponse;

  for (const channel of channels) {
    const conversation = convertToConversation(channel);
    await ORM.conversation.upsert({
      where: { conversation_id: conversation.conversation_id },
      create: conversation,
      update: conversation,
    });
  }
};

export const fetchUsers = async (slackName?: string) => {
  const config = loadSlackConfig(slackName);

  const usersListResponse = await usersList(config.token);
  if (!usersListResponse.ok || !usersListResponse.members) {
    throw new Error();
  }

  const { members } = usersListResponse;

  for (const member of members) {
    const user = convertToUser(member);
    await ORM.user.upsert({
      where: { user_id: user.user_id },
      create: user,
      update: user,
    });
  }
};

export const fetchMessages = async (channel_id: string, slackName?: string) => {
  const config = loadSlackConfig(slackName);

  const conversationsHistoryResponse = await conversationsHistory(
    config.token,
    channel_id
  );
  if (
    !conversationsHistoryResponse.ok ||
    !conversationsHistoryResponse.messages
  ) {
    throw new Error();
  }

  const { messages } = conversationsHistoryResponse;

  for (const _ of messages) {
    console.log(_);
    const message = convertToMessage(channel_id, _);
    await ORM.message.create({
      data: message,
    });
  }
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
