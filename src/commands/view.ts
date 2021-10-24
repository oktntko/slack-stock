import { Command, flags } from "@oclif/command";
import { view } from "../commands";

export default class View extends Command {
  static description = "View data";

  static flags = {
    help: flags.help({ char: "h" }),
    channel: flags.string({
      char: "c",
      description: "if fetch message data, set channel name or channel id",
    }),
    from: flags.string({
      char: "f",
      description: "if fetch message data, set from date, format=yyyy-MM-dd",
    }),
    to: flags.string({
      char: "t",
      description: "if fetch message data, set to date, format=yyyy-MM-dd",
    }),
  };

  static args = [
    {
      name: "data",
      description: "select output data",
      required: false,
      hidden: false,
      options: ["message", "user", "channel"],
    },
    {
      name: "output",
      description: "select output type",
      required: false,
      hidden: false,
      options: ["console", "csv", "tsv", "excel"],
    },
  ];

  async run() {
    const { args, flags } = this.parse(View);

    await view(args.data, args.output, flags.channel, flags.from, flags.to);
  }
}
