import crypto from "crypto";
import fs from "fs";
import os from "os";
import path from "path";

const PASSWORD_PATH = path.join(os.homedir(), ".slack-stock.password");

const existsPassword = () => fs.existsSync(PASSWORD_PATH);

const createPassword = () => fs.writeFileSync(PASSWORD_PATH, crypto.randomBytes(15).toString("base64"), "utf8");

const readPassword = () => fs.readFileSync(PASSWORD_PATH, "utf8");

if (!existsPassword()) {
  createPassword();
}

export const password = readPassword();
