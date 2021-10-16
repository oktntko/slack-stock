import { LogLevel, WebClient } from "@slack/web-api";

const client = new WebClient(undefined, {
  logLevel: LogLevel.DEBUG,
});

export const conversationsList = (
  token: string,
  exclude_archived?: boolean,
  types?: "public_channel" | "private_channel" | "mpim" | "im",
  team_id?: string,
  limit?: number,
  cursor?: string
) =>
  client.conversations.list({
    token,
    cursor,
    exclude_archived,
    limit,
    team_id,
    types,
  });

export const conversationsHistory = (
  token: string,
  channel: string,
  oldest?: string,
  latest?: string,
  inclusive?: boolean,
  limit?: number,
  cursor?: string
) =>
  client.conversations.history({
    token,
    channel,
    cursor,
    inclusive,
    latest,
    limit,
    oldest,
  });

export const usersList = (
  token: string,
  team_id?: string,
  include_locale?: boolean,
  limit?: number,
  cursor?: string
) =>
  client.users.list({
    token,
    cursor,
    include_locale,
    limit,
    team_id,
  });
