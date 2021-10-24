import { Command } from "@oclif/command";
import { contact } from "../commands";

export default class Contact extends Command {
  static description = "Contact support";

  async run() {
    contact();
  }
}
