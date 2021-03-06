import { Command, flags } from "@oclif/command";
import dayjs, { Dayjs } from "dayjs";
import { COMMANDS } from "../app/ui-commands";

export default class Messages extends Command {
  static aliases = ["m", "message"];
  static description = "You can stock & view message";

  static flags = {
    help: flags.help({ char: "h" }),
    channel: flags.string({
      char: "c",
      description: "Enter channel name",
    }),
    period: flags.string({
      char: "p",
      multiple: true,
      exclusive: ["month", "week", "day"],
      description: `Enter period. ex) --period="YYYY-MM-DD" "YYYY-MM-DD"`,
    }),
    month: flags.boolean({
      char: "m",
      exclusive: ["period", "week", "day"],
      description: "If this flag ON, period is from one month ago to now.",
    }),
    week: flags.boolean({
      char: "w",
      exclusive: ["period", "month", "day"],
      description: "If this flag ON, period is from one week ago to now.",
    }),
    day: flags.boolean({
      char: "d",
      exclusive: ["period", "week", "month"],
      description: "If this flag ON, period is from one day ago to now.",
    }),
    output: flags.string({
      char: "o",
      description: "Select output format",
      multiple: false,
      options: ["console", "csv", "tsv", "xlsx"],
    }),
    keyword: flags.string({
      char: "k",
      multiple: true,
      description: `Enter timer keyword. ex) --keyword="start" "stop"`,
    }),
  };

  static args = [
    {
      name: "action",
      required: false,
      hidden: false,
      options: ["stock", "view", "search", "timer"],
    },
  ];

  async run() {
    const { args, flags } = this.parse(Messages);

    const period = parsePeriod(flags.period, flags.month, flags.week, flags.day);
    const { startKeyword, stopKeyword } = parseKeyword(flags.keyword);

    switch (args.action) {
      case "stock":
        await COMMANDS.messages.stock({ channel: flags.channel, oldest: period.oldest, latest: period.latest });
        break;
      case "view":
        await COMMANDS.messages.view({
          channel: flags.channel,
          oldest: period.oldest,
          latest: period.latest,
          output: flags.output as OutputType,
        });
        break;
      case "timer":
        await COMMANDS.messages.timer({
          channel: flags.channel,
          oldest: period.oldest,
          latest: period.latest,
          startKeyword,
          stopKeyword,
          output: flags.output as OutputType,
        });
        break;
      case "search":
        await COMMANDS.messages.search();
        break;
      default:
        await COMMANDS.menu(
          { object: "messages" },
          {
            channel: flags.channel,
            oldest: period.oldest,
            latest: period.latest,
            output: flags.output as OutputType,
          }
        );
        break;
    }
  }
}

export const parsePeriod = (
  period?: string[],
  month?: boolean,
  week?: boolean,
  day?: boolean
): { oldest?: Dayjs; latest?: Dayjs } => {
  // ????????????????????????
  if (period && period.length > 0) {
    if (period.length > 2) throw new Error();

    const oldest = dayjs(period[0]);
    if (!oldest.isValid()) throw new Error();

    const latest = period.length > 1 ? dayjs(period[0]) : dayjs();
    if (!latest.isValid()) throw new Error();

    return { oldest: oldest.startOf("day"), latest: latest.endOf("day") };

    // ????????????????????????
  } else if (month || week || day) {
    const latest = dayjs();

    const oldest = latest.subtract(1, month ? "month" : week ? "week" : "day");
    return { oldest: oldest.startOf("day"), latest: latest.endOf("day") };

    // ??????????????????????????????
  } else {
    return {};
  }
};

export const parseKeyword = (keyword?: string[]): { startKeyword?: string; stopKeyword?: string } => {
  if (keyword && keyword.length > 0) {
    if (keyword.length !== 2) throw new Error();

    return { startKeyword: keyword[0], stopKeyword: keyword[1] };

    // ??????????????????????????????
  } else {
    return {};
  }
};
