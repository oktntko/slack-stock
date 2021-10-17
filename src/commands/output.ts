import {
  selectChannel,
  selectDataType,
  selectDate,
  selectOutputType,
} from "@/interactive";
import ORM from "@/wrapper/ORM";
import { Command, flags } from "@oclif/command";
import { DataFrame } from "danfojs-node";

export default class Output extends Command {
  static description = "describe the command here";

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
    const { args, flags } = this.parse(Output);

    await output(args.data, args.output, flags.channel, flags.from, flags.to);
  }
}

const output = async (
  data?: DataType,
  output?: OutputType,
  channel?: string,
  from?: string,
  to?: string
) => {
  const selection = await selectDataType(data);

  let df;
  switch (selection) {
    case "message":
      const channel_id = await selectChannel(channel);
      const oldest = await selectDate("please input oldest date", from);
      const latest = await selectDate("please input latest date", to);
      latest.setDate(latest.getDate() + 1);

      const messages = await selectMessages(channel_id, oldest, latest);
      df = new DataFrame(messages);
      break;
    case "user":
      const users = await selectUsers();
      df = new DataFrame(users);
      break;
    case "channel":
      const channels = await selectChannels();
      df = new DataFrame(channels);
      break;
  }

  const outputSelection = await selectOutputType(output);
  const date = new Date();
  const filePath = `./${date.getFullYear()}-${(
    "0" +
    (date.getMonth() + 1)
  ).slice(-2)}-${("0" + date.getDate()).slice(
    -2
  )}_${selection}.${outputSelection}`;

  switch (outputSelection) {
    case "console":
      df.print();
      break;
    case "csv":
      df.to_csv({
        filePath,
        sep: ",",
        header: true,
      });
      break;
    case "tsv":
      df.to_csv({
        filePath,
        sep: "\t",
        header: true,
      });
      break;
    case "json":
      df.to_json({
        filePath,
        format: "column",
      });
      break;
    case "excel":
      df.to_excel({
        filePath,
      });
      break;
  }
};

const selectMessages = async (channel_id: string, oldest: Date, latest: Date) =>
  await ORM.message.findMany({
    where: {
      channel_id: channel_id,
      AND: [
        { ts: { gte: String(Math.floor(oldest.getTime() / 1000)) } },
        { ts: { lte: String(Math.floor(latest.getTime() / 1000)) } },
      ],
    },
  });

const selectChannels = async () => await ORM.channel.findMany();

const selectUsers = async () => await ORM.user.findMany();
