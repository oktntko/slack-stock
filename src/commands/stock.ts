import { Command, flags } from "@oclif/command";
import dayjs, { Dayjs } from "dayjs";
import { stock } from "../cui";

export default class Stock extends Command {
  static description = "Stock data";

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
      description: "select stock data",
      required: false,
      hidden: false,
      options: ["message", "user", "channel"],
    },
    {
      name: "team",
      description: "select stock team",
      required: false,
      hidden: false,
    },
  ];

  async run() {
    const { args, flags } = this.parse(Stock);

    const period = parsePeriod(flags.period, flags.month, flags.week, flags.day);

    await stock(
      {
        data: args.data,
        team: args.team,
      },
      {
        channel: flags.channel,
        oldest: period.oldest,
        latest: period.latest,
      }
    );
  }
}

export const parsePeriod = (
  period?: string[],
  month?: boolean,
  week?: boolean,
  day?: boolean
): { oldest?: Dayjs; latest?: Dayjs } => {
  // 絶対値指定の場合
  if (period && period.length > 0) {
    if (period.length > 2) throw new Error();

    const oldest = dayjs(period[0]);
    if (!oldest.isValid()) throw new Error();

    const latest = period.length > 1 ? dayjs(period[0]) : dayjs();
    if (!latest.isValid()) throw new Error();

    return { oldest: oldest.startOf("day"), latest: latest.endOf("day") };

    // 相対値指定の場合
  } else if (month || week || day) {
    const latest = dayjs();

    const oldest = latest.subtract(1, month ? "month" : week ? "week" : "day");
    return { oldest: oldest.startOf("day"), latest: latest.endOf("day") };
  }

  // オプションなしの場合
  return {};
};
