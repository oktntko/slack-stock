import { LogLevel, WebClient } from "@slack/web-api";
import inquirer from "inquirer";

////////////////////////////////////////////////////
// INTERACTIVE
////////////////////////////////////////////////////
inquirer.registerPrompt(
  "autocomplete",
  require("inquirer-autocomplete-prompt")
);
// https://intl-date-time-format-checker.pages.dev/
inquirer.registerPrompt("date", require("inquirer-date-prompt"));

export const INTERACTIVE = inquirer;

////////////////////////////////////////////////////
// CHAT
////////////////////////////////////////////////////
const client = new WebClient(undefined, {
  logLevel: LogLevel.DEBUG,
});

export const CHAT = {
  conversationsList(
    token: string,
    exclude_archived?: boolean,
    types?: "public_channel" | "private_channel" | "mpim" | "im",
    team_id?: string,
    limit?: number,
    cursor?: string
  ) {
    return client.conversations.list({
      token,
      cursor,
      exclude_archived,
      limit,
      team_id,
      types,
    });
  },

  conversationsHistory(
    token: string,
    channel: string,
    oldest: Date,
    latest: Date,
    inclusive?: boolean,
    limit?: number,
    cursor?: string
  ) {
    return client.conversations.history({
      token,
      channel,
      cursor,
      inclusive,
      limit,
      latest: String(Math.floor(latest.getTime() / 1000)),
      oldest: String(Math.floor(oldest.getTime() / 1000)),
    });
  },

  usersList(
    token: string,
    team_id?: string,
    include_locale?: boolean,
    limit?: number,
    cursor?: string
  ) {
    return client.users.list({
      token,
      cursor,
      include_locale,
      limit,
      team_id,
    });
  },
};
