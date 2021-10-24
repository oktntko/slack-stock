// ! user interface
import { Channel, Message, User } from "@prisma/client";
import { execSync, spawnSync } from "child_process";
import { cli } from "cli-ux";
import dayjs from "dayjs";
import {
  fetchChannels,
  fetchMessages,
  fetchUsers,
  findChannels,
  findMessages,
  findUsers,
} from "./api";
import {
  selectChannel,
  selectDataType,
  selectDate,
  selectMenu,
  selectOutputType,
} from "./components";
import { DB_PATH, SLACK_STOCK_RC } from "./const";
import { mapper } from "./db";
import { output } from "./output";
import {
  createDefaultConfigFile,
  isExistsConfigFile,
  isWin32,
  loadSlackConfig,
  yyyyMMdd,
} from "./utils";

////////////////////////////////////////////////////
// stock
////////////////////////////////////////////////////

export const stock = async (
  name?: string,
  data?: DataType,
  channel?: string,
  from?: string,
  to?: string
) => {
  const { token } = loadSlackConfig(name);
  if (token == null) {
    throw new Error();
  }

  const selection = await selectDataType(data);

  switch (selection) {
    case "message":
      await stockMessages(token, channel, from, to);
      return;
    case "user":
      await stockUsers(token);
      return;
    case "channel":
      await stockChannels(token);
      return;
  }
};

export const stockMessages = async (
  token: string,
  channel?: string,
  from?: string,
  to?: string
) => {
  const channel_id = await selectChannel(channel);
  const oldest = await selectDate("please input oldest date", from);
  const latest = await selectDate("please input latest date", to);
  latest.setDate(latest.getDate() + 1);

  await fetchMessages(token, channel_id, oldest, latest);
};

export const stockUsers = async (token: string) => {
  await fetchUsers(token);
};

export const stockChannels = async (token: string) => {
  await fetchChannels(token);
};

export const stockAll = async (token: string) => {
  await fetchUsers(token);
  await fetchChannels(token);
  const channels = mapper.channel.findMany();
  const oldest = dayjs().startOf("months").toDate();
  const latest = dayjs().endOf("months").toDate();
  for (const channel of channels) {
    await fetchMessages(token, channel.channel_id, oldest, latest);
  }
};

////////////////////////////////////////////////////
// view
////////////////////////////////////////////////////

export const view = async (
  dataType?: DataType,
  outputType?: OutputType,
  channel?: string,
  from?: string,
  to?: string
) => {
  const dataTypeSelection = await selectDataType(dataType);

  const data = await pick(dataTypeSelection, channel, from, to);

  const outputTypeSelection = await selectOutputType(outputType);

  const fileName = `./${yyyyMMdd()}_${dataTypeSelection}.${outputTypeSelection}`;

  await output(outputTypeSelection, data, fileName);
};

export const pick = async (
  data: DataType,
  channel?: string,
  from?: string,
  to?: string
): Promise<Message[] | User[] | Channel[]> => {
  switch (data) {
    case "message":
      return await pickMessages(channel, from, to);
    case "user":
      return await pickUsers();
    case "channel":
      return await pickChannels();
  }
};

export const pickMessages = async (
  channel?: string,
  from?: string,
  to?: string
) => {
  const channel_id = await selectChannel(channel);
  const oldest = await selectDate("please input oldest date", from);
  const latest = await selectDate("please input latest date", to);
  latest.setDate(latest.getDate() + 1);

  return await findMessages(channel_id, oldest, latest);
};

export const pickUsers = async () => await findUsers();

export const pickChannels = async () => await findChannels();

////////////////////////////////////////////////////
// config
////////////////////////////////////////////////////
export const config = async () => {
  if (isWin32()) {
    execSync(`start ${SLACK_STOCK_RC}`);
  } else {
    spawnSync(process.env.EDITOR || "vi", [SLACK_STOCK_RC], {
      stdio: [process.stdin, process.stdout, process.stderr],
    });
  }
};

////////////////////////////////////////////////////
// tutorial
////////////////////////////////////////////////////
export const tutorial = async () => {
  // (cli)  コンフィグファイルがない場合作成する
  if (!isExistsConfigFile()) {
    createDefaultConfigFile();
    console.log(`🆗 Config file created, see path: "${SLACK_STOCK_RC}"`);
  }
  // (cli)  token の取得方法を表示する
  console.log("📥 Please setup slack app and copy token");
  cli.open("https://github.com/oktntko/slack-stock#setup-slack-app");
  await cli.anykey();

  // (cli)  コンフィグファイルをオープンする
  console.log(`📝 Input token you got from slack app.`);
  await config();

  // (cli)  データを取得する
  const { token } = loadSlackConfig();
  await stockAll(token);
  console.log(`🆗 Stocked all data. see path: "${DB_PATH}"`);

  // (cli)  データを出力する
  console.log(`💡 You can view data, please select data you want to view.`);
  await view();

  // (cli)  テキストを表示して終了する
  console.log(`☺️ Finish! Have a great Slack Life with slack-stock!`);
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
    case "config":
      await config();
      return;
    case "tutorial":
      tutorial();
      return;
    case "contact":
      contact();
      return;
    case "exit":
      console.log("bye!");
      return;
  }
};
