import { Command, flags } from "@oclif/command";
import { config } from "../commands";
import { createDefaultConfigFile, isExistsConfigFile } from "../utils";

export default class Config extends Command {
  static description = "describe the command here";

  static flags = {
    help: flags.help({ char: "h" }),
  };

  async run() {
    if (!isExistsConfigFile()) {
      createDefaultConfigFile();
    }

    await config();
  }
}
