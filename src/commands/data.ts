import { Command, flags } from "@oclif/command";
import { COMMANDS } from "../app/ui-commands";

export default class Data extends Command {
  static aliases = ["d"];
  static description = "describe the command here";

  static flags = {
    help: flags.help({ char: "h" }),
    team: flags.string({
      char: "t",
      multiple: false,
      description: "Select your team",
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
      required: false,
      hidden: false,
      options: ["fetch", "view"],
    },
  ];

  async run() {
    const { args, flags } = this.parse(Data);

    switch (args.action) {
      case "fetch":
        await COMMANDS.data.fetch({ team: flags.team });
        break;
      case "view":
        await COMMANDS.data.view({ team: flags.team, output: flags.output as OutputType });
        break;
      default:
        await COMMANDS.menu({ object: "data" }, flags);
        break;
    }
  }
}
