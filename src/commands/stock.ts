import { stock } from "@/commands";
import { isExistsConfigFile } from "@/utils";
import { Command, flags } from "@oclif/command";

export default class Stock extends Command {
  static description = "describe the command here";

  static flags = {
    help: flags.help({ char: "h" }),
    name: flags.string({
      char: "n",
      description: "slack name from config file",
    }),
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
      description: "select fetch data",
      required: false,
      hidden: false,
      options: ["message", "user", "channel"],
    },
  ];

  async run() {
    const { args, flags } = this.parse(Stock);

    if (!isExistsConfigFile()) {
      throw new Error();
    }

    await stock(flags.name, args.data, flags.channel, flags.from, flags.to);
  }
}
