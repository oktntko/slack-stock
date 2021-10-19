import { contact } from "@/commands";
import { Command } from "@oclif/command";

export default class Contact extends Command {
  static description = "describe the command here";

  async run() {
    contact();
  }
}
