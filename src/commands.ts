// ! user interface
import { Channel, Message, User } from "@prisma/client";
import { execSync, spawn } from "child_process";
import { cli } from "cli-ux";
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
import { SLACK_STOCK_RC } from "./const";
import { output } from "./output";
import { isWin32, loadSlackConfig, yyyyMMdd } from "./utils";

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
    spawn(process.env.EDITOR || "vi", [SLACK_STOCK_RC], {
      stdio: [process.stdin, process.stdout, process.stderr],
    });
  }
};

////////////////////////////////////////////////////
// tutorial
////////////////////////////////////////////////////
export const tutorial = () => {
  console.log("📞 please visit github and use issues or PR");
  cli.open("https://github.com/oktntko/slack-stock");
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
