import { Command, flags } from "@oclif/command";
import { COMMANDS } from "../app/ui-commands";

export default class Teams extends Command {
  static aliases = ["t", "team"];
  static description = "describe the command here";

  static flags = {
    help: flags.help({ char: "h" }),
    token: flags.string({
      char: "t",
      multiple: false,
      description: "user OAuth token installed your workspace",
    }),
    output: flags.string({
      char: "t",
      description: "Select your output",
      multiple: false,
      options: ["console", "csv", "tsv", "xlsx"],
    }),
  };

  static args = [
    {
      name: "action",
      description: "user OAuth token installed your workspace",
      required: false,
      hidden: false,
      options: ["add", "view"],
    },
  ];

  async run() {
    const { args, flags } = this.parse(Teams);

    switch (args.action) {
      case "add":
        await COMMANDS.teams.add({ token: flags.token });
        break;
      case "view":
        await COMMANDS.teams.view({ output: flags.output as OutputType });
        break;
      default:
        await COMMANDS.menu({ object: "teams" }, flags);
        break;
    }
  }
}
