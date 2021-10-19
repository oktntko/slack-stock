// ! utils
import dayjs from "dayjs";
import fs from "fs";
import yaml from "js-yaml";
import os from "os";
import path from "path";

////////////////////////////////////////////////////
// config
////////////////////////////////////////////////////
export const SLSTRC = path.join(os.homedir(), ".slstrc");

export const isExistsConfigFile = (): boolean => fs.existsSync(SLSTRC);

export const createDefaultConfigFile = () => {
  const defaultConfig: Slstrc = {
    default: "my-slack",
    slack_config: {
      "my-slack": {
        token: "<your Slack token>",
      },
    },
  };

  saveConfig(defaultConfig);
};

export const loadConfig = (): Slstrc => {
  try {
    const config = yaml.load(fs.readFileSync(SLSTRC, "utf8"));

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

const saveConfig = (config: Slstrc): void => {
  const yamlText = yaml.dump(config);
  fs.writeFileSync(SLSTRC, yamlText, "utf8");
};

const isConfig = (unkownConfig: unknown): unkownConfig is Slstrc => {
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
