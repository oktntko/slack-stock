import { LogLevel, WebClient } from '@slack/web-api';

export const slack = new WebClient(undefined, {
  logLevel: LogLevel.WARN,
});
