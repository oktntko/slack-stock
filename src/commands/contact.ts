import { Command } from "@oclif/command";
import { cli } from "cli-ux";

export default class Contact extends Command {
  static description = "describe the command here";

  async run() {
    contact();
  }
}

export const contact = () => {
  console.log("📞 please visit github and use issues or PR");
  cli.open("https://github.com/oktntko/slack-stock");
};
