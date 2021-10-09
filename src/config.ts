import yaml from "js-yaml";
import fs from "fs";
import path from "path";
import os from "os";

const SLSTRC = path.join(os.homedir(), ".slstrc");

export const isExistsConfigFile = (): boolean => {
  return fs.existsSync(SLSTRC);
};

export const createDefaultConfigFile = () => {
  const config_file_default: Config = {
    default: "my-slack",
    slack_config: {
      "my-slack": {
        token: "<your Slack token>",
      },
    },
  };

  yaml.dump(config_file_default);
};

export const loadConfig = (slack_name: string): Config => {
  try {
    const doc = yaml.load(fs.readFileSync(SLSTRC, "utf8"));
    if (!isConfig(doc)) throw new Error();
    return doc;
  } catch (e) {
    console.log(e);
    throw e;
  }
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
