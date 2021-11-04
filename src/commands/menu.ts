import { Command, flags } from "@oclif/command";
import { COMMANDS } from "../app/ui-commands";

export default class Menu extends Command {
  static aliases = [""];
  static description = "Select menu";

  static flags = {
    help: flags.help({ char: "h" }),
  };

  async run() {
    await COMMANDS.menu();
  }
}
