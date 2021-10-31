import { Command, flags } from "@oclif/command";
import { add } from "../cui";

export default class Add extends Command {
  static description = "describe the command here";

  static flags = {
    help: flags.help({ char: "h" }),
  };

  static args = [
    {
      name: "token",
      description: "user OAuth token installed your workspace",
      required: false,
      hidden: false,
    },
  ];

  async run() {
    const { args } = this.parse(Add);

    await add(args.token);
  }
}
