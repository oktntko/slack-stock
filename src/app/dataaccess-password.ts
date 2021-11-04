import crypto from "crypto";
import fs from "fs";
import os from "os";
import path from "path";

const ALGORITHM = "aes-256-ctr";
const IV_LENGTH = 16;
const PASSWORD_LENGTH = 23;

const PASSWORD_PATH = path.join(os.homedir(), ".slack-stock.password");

const existsPassword = () => fs.existsSync(PASSWORD_PATH);

const createPassword = () =>
  fs.writeFileSync(PASSWORD_PATH, crypto.randomBytes(PASSWORD_LENGTH).toString("base64"), "utf8");

const readPassword = () => fs.readFileSync(PASSWORD_PATH, "utf8");

if (!existsPassword()) {
  createPassword();
}

const PASSWORD = readPassword();

export const encrypt = (text: string) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, PASSWORD, iv);
  return Buffer.concat([iv, cipher.update(Buffer.from(text)), cipher.final()]).toString("base64");
};

export const decrypt = (data: string) => {
  const buff = Buffer.from(data, "base64");
  const iv = buff.slice(0, IV_LENGTH);
  const encData = buff.slice(IV_LENGTH);
  const decipher = crypto.createDecipheriv(ALGORITHM, PASSWORD, iv);
  return Buffer.concat([decipher.update(encData), decipher.final()]).toString("utf8");
};
