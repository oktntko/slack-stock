import crypto from 'crypto';
import fs from 'fs';
import os from 'os';
import path from 'path';

const PASSWORD_LENGTH = 23;

const PASSWORD_PATH = path.join(os.homedir(), '.slack-stock.password');

if (!fs.existsSync(PASSWORD_PATH)) {
  fs.writeFileSync(PASSWORD_PATH, crypto.randomBytes(PASSWORD_LENGTH).toString('base64'), 'utf8');
}

const PASSWORD = fs.readFileSync(PASSWORD_PATH, 'utf8');

////////////////////////////////
// 暗号化・複合化
////////////////////////////////

const ALGORITHM = 'aes-256-ctr';
const IV_LENGTH = 16;

export function encrypt(text: string, key = PASSWORD) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  return Buffer.concat([iv, cipher.update(Buffer.from(text)), cipher.final()]).toString('base64');
}

export function decrypt(data: string, key = PASSWORD) {
  const buff = Buffer.from(data, 'base64');

  const iv = buff.subarray(0, IV_LENGTH);
  const encData = buff.subarray(IV_LENGTH);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

  return Buffer.concat([decipher.update(encData), decipher.final()]).toString('utf8');
}
