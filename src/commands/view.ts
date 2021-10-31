import { Command, flags } from "@oclif/command";
import { view } from "../cui";
import { parsePeriod } from "./stock";

export default class View extends Command {
  static description = "View data";

  static flags = {
    help: flags.help({ char: "h" }),
    channel: flags.string({
      char: "c",
      description: "if stock message data, set channel name or channel id",
    }),
    period: flags.string({
      char: "p",
      multiple: true,
      exclusive: ["month", "week", "day"],
      description: "if stock message data, set from date, format=yyyy-MM-dd",
    }),
    month: flags.boolean({
      char: "m",
      exclusive: ["period", "week", "day"],
      description: "if stock message data, set to date, format=yyyy-MM-dd",
    }),
    week: flags.boolean({
      char: "w",
      exclusive: ["period", "month", "day"],
      description: "if stock message data, set to date, format=yyyy-MM-dd",
    }),
    day: flags.boolean({
      char: "d",
      exclusive: ["period", "week", "month"],
      description: "if stock message data, set to date, format=yyyy-MM-dd",
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

    const period = parsePeriod(flags.period, flags.month, flags.week, flags.day);

    await view(
      {
        data: args.data,
        output: args.output,
      },
      {
        channel: flags.channel,
        oldest: period.oldest,
        latest: period.latest,
      }
    );
  }
}
