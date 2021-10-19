import os from "os";
import path from "path";

export const SLACK_STOCK_RC = path.join(os.homedir(), ".slack-stock.rc");

export const DB_PATH = path.join(os.homedir(), ".slack-stock.db");
