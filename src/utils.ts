// ! utils
import dayjs from "dayjs";
import fs from "fs";
import yaml from "js-yaml";
import { SLACK_STOCK_RC } from "./const";

////////////////////////////////////////////////////
// config
////////////////////////////////////////////////////
export const isExistsConfigFile = (): boolean => fs.existsSync(SLACK_STOCK_RC);

export const createDefaultConfigFile = () => {
  const defaultConfig: SlackStockRc = {
    default: "my-slack",
    slack_config: {
      "my-slack": {
        token: "<your Slack token>",
      },
    },
  };

  saveConfig(defaultConfig);
};

export const loadConfig = (): SlackStockRc => {
  try {
    const config = yaml.load(fs.readFileSync(SLACK_STOCK_RC, "utf8"));

    if (isConfig(config)) return config;

    throw new Error();
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const loadSlackConfig = (name?: string): SlackConfig => {
  const config = loadConfig();

  return config.slack_config[name ? name : config.default];
};

const saveConfig = (config: SlackStockRc): void => {
  const yamlText = yaml.dump(config);
  fs.writeFileSync(SLACK_STOCK_RC, yamlText, "utf8");
};

const isConfig = (unkownConfig: unknown): unkownConfig is SlackStockRc => {
  if (typeof unkownConfig !== "object" || unkownConfig == null) {
    return false;
  }

  const config = unkownConfig as any;
  if (config.default == null || typeof config.default !== "string") {
    return false;
  }
  if (config.slack_config == null || typeof config.slack_config !== "object") {
    return false;
  }

  return true;
};

////////////////////////////////////////////////////
// os
////////////////////////////////////////////////////

export const isWin32 = (): boolean => process.platform === "win32";

////////////////////////////////////////////////////
// date
////////////////////////////////////////////////////
export const yyyyMMdd = () => dayjs().format("YYYY-MM-DD");
