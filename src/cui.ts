// ! user interface
import { Channel, Message, Team, User } from "@prisma/client";
import { cli } from "cli-ux";
import dayjs, { Dayjs } from "dayjs";
import fs from "fs";
import Papa from "papaparse";
import toExcel from "write-excel-file/node";
import { CONTROLLER } from "./app/middleware-controller";
import { COLOR } from "./app/cui-colors";
import {
  inputToken,
  selectChannel,
  selectDataType,
  selectDate,
  selectMenu,
  selectOutputType,
  selectTeam,
} from "./app/cui-components";

////////////////////////////////////////////////////
// add
////////////////////////////////////////////////////
export const add = async (token?: string) => {
  // token が入力されていない場合、token の取得方法を表示する
  if (!token) {
    console.log("📥 Please setup slack app and copy token");

    await cli.open("https://github.com/oktntko/slack-stock#setup-slack-app");

    const no = !(await cli.confirm(`${COLOR.success("❓")} Are you ready? (Did you copy workspace's OAuth token?)`));

    if (no) return;
  }

  // Team を登録する
  const team = await addTeam({ token });

  // 各データを登録する
  cli.action.start(`${COLOR.info("ℹ️")}  Start stock user data`);
  await CONTROLLER.users.fetch(team.token);
  cli.action.stop(COLOR.success("✔️"));

  cli.action.start(`${COLOR.info("ℹ️")}  Start stock channel data`);
  await CONTROLLER.channels.fetch(team);
  cli.action.stop(COLOR.success("✔️"));

  console.log(`${COLOR.info("ℹ️")}  Select channel you want to stock message data`);
  await stockMessages(team);

  console.log(`${COLOR.success("🆗")} Stocked all data.`);

  // データを出力する
  console.log(`${COLOR.info("💡")} You can view data, please select data you want to view.`);
  await view();

  console.log(`${COLOR.success("☺️")} Finish! Have a great Slack Life with slack-stock!`);
};

const addTeam = async (options: { token?: string }) => {
  while (true) {
    const token = await inputToken(options.token);

    const team = await CONTROLLER.team.add(token).catch<Error>((err) => err);

    if (team instanceof Error) {
      console.error(`${COLOR.error("❌")} ${team.message}`);
      delete options.token;
    } else {
      return team;
    }
  }
};

////////////////////////////////////////////////////
// stock
////////////////////////////////////////////////////

export const stock = async (
  args: {
    data?: DataType;
    team?: string;
  } = {},
  options: {
    channel?: string;
    oldest?: Dayjs;
    latest?: Dayjs;
  } = {}
) => {
  const data = await selectDataType(args.data);

  const team = await selectTeam(args.team);

  switch (data) {
    case "user":
      await stockUsers(team.token);
      return;
    case "channel":
      await stockChannels(team);
      return;
    case "message":
      await stockMessages(team, options);
      return;
  }
};

const stockUsers = async (token: string) => {
  await CONTROLLER.users.fetch(token);
};

const stockChannels = async ({ team_id, token }: Pick<Team, "team_id" | "token">) => {
  await CONTROLLER.channels.fetch({ team_id, token });
};

const stockMessages = async (
  { team_id, token }: Pick<Team, "team_id" | "token">,
  options: { channel?: string; oldest?: Dayjs; latest?: Dayjs } = {}
) => {
  const channel = await selectChannel(options.channel);

  const oldest = await selectDate(
    options.oldest,
    "Select start date",
    dayjs().subtract(1, "day").startOf("day") /* yesterday */
  );

  const latest = await selectDate(options.latest, "Select end date", dayjs().endOf("day") /* today */);

  await CONTROLLER.messages.fetch({ team_id, token, channel_id: channel.channel_id, oldest, latest });
};

////////////////////////////////////////////////////
// view
////////////////////////////////////////////////////

export const view = async (
  args: {
    data?: DataType;
    output?: OutputType;
  } = {},
  options: {
    channel?: string;
    oldest?: Dayjs;
    latest?: Dayjs;
  } = {}
) => {
  const dataType = await selectDataType(args.data);

  const data = await pick(dataType, options);

  const outputType = await selectOutputType(args.output);

  await output(outputType, data, "fileName");
};

const pick = async (
  data: DataType,
  options: { channel?: string; oldest?: Dayjs; latest?: Dayjs } = {}
): Promise<Message[] | User[] | Channel[]> => {
  switch (data) {
    case "user":
      return await pickUsers();
    case "channel":
      return await pickChannels();
    case "message":
      return await pickMessages(options);
  }
};

const pickUsers = async () => CONTROLLER.users.find();

const pickChannels = async () => CONTROLLER.channels.find();

const pickMessages = async (options: { channel?: string; oldest?: Dayjs; latest?: Dayjs } = {}) => {
  const channel = await selectChannel(options.channel);

  const oldest = await selectDate(
    options.oldest,
    "Select start date",
    dayjs().subtract(1, "day").startOf("day") /* yesterday */
  );

  const latest = await selectDate(options.latest, "Select end date", dayjs().endOf("day"));

  return CONTROLLER.messages.find({ channel_id: channel.channel_id, oldest, latest });
};

const output = async (output: OutputType, data: any[], filePath: string, schema?: any[]) => {
  if (data.length === 0) {
    console.error("No data.");
    return;
  }

  switch (output) {
    case "console":
      console.table(data);
      break;
    case "csv":
    case "tsv":
      toXsv(output === "tsv" ? "\t" : ",", data, filePath);
      break;
    case "excel":
      await toExcel(data, {
        schema: schema
          ? schema
          : Object.keys(data[0]).map((key) => ({
              column: key,
              value: (obj: any) => obj[key],
            })),
        filePath,
        headerStyle: {
          backgroundColor: "#eeeeee",
          fontWeight: "bold",
          align: "center",
        },
        dateFormat: "yyyy-mm-dd hh:mm:ss",
      });
      break;
  }
};

const toXsv = (delimiter: string, data: any[], filePath: string) => {
  const parsed = Papa.unparse(data, {
    delimiter,
    header: true,
    newline: "\n",
    escapeFormulae: true,
  });

  fs.writeFileSync(filePath, parsed, {
    encoding: "utf8",
  });
};

////////////////////////////////////////////////////
// contact
////////////////////////////////////////////////////
export const contact = () => {
  console.log("📞 please visit github and use issues or PR");
  cli.open("https://github.com/oktntko/slack-stock");
};

////////////////////////////////////////////////////
// hello
////////////////////////////////////////////////////

export const hello = async () => {
  const menu = await selectMenu();

  switch (menu) {
    case "stock":
      await stock();
      return;
    case "view":
      await view();
      return;
    case "add":
      add();
      return;
    case "contact":
      contact();
      return;
    case "exit":
      console.log("bye!");
      return;
  }
};
