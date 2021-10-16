import yaml from "js-yaml";
import fs from "fs";
import path from "path";
import os from "os";

const SLSTRC = path.join(os.homedir(), ".slstrc");

export const isExistsConfigFile = (): boolean => {
  return fs.existsSync(SLSTRC);
};

export const createDefaultConfigFile = () => {
  const defaultConfig: Config = {
    default: "my-slack",
    slack_config: {
      "my-slack": {
        token: "<your Slack token>",
      },
    },
  };

  saveConfig(defaultConfig);
};

export const loadConfig = (): Config => {
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

export const saveConfig = (config: Config): void => {
  const yamlText = yaml.dump(config);
  fs.writeFileSync(SLSTRC, yamlText, "utf8");
};

const isConfig = (unkownConfig: unknown): unkownConfig is Config => {
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
