import inquirer from "inquirer";
import {
  createDefaultConfigFile,
  isExistsConfigFile,
  loadConfig,
  saveConfig,
} from "@/config";

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
          value: "📥Export data",
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
