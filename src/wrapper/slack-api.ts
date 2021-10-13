import { Conversation, User, Prisma } from "@prisma/client";
import { WebClient, LogLevel } from "@slack/web-api";
import { Message } from "@slack/web-api/dist/response/ConversationsHistoryResponse";
import { Channel } from "@slack/web-api/dist/response/ConversationsListResponse";
import { Member } from "@slack/web-api/dist/response/UsersListResponse";

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

export const convertToConversation = (channel: Channel): Conversation => ({
  conversation_id: channel.id!,
  name: channel.name!,
  is_channel: channel.is_channel!,
  is_group: channel.is_group!,
  is_im: channel.is_im!,
  is_mpim: channel.is_mpim!,
  is_private: channel.is_private!,
  is_archived: channel.is_archived!,
  is_general: channel.is_general!,
  is_shared: channel.is_shared!,
  is_org_shared: channel.is_org_shared!,
  is_pending_ext_shared: channel.is_pending_ext_shared!,
  is_ext_shared: channel.is_ext_shared!,
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

export const convertToMessage = (
  conversation_id: string,
  message: Message
): Prisma.MessageUncheckedCreateInput => ({
  conversation_id: conversation_id,
  type: message.type!,
  user_id: message.user!,
  team_id: message.team,
  text: message.text!,
  ts: new Date(Number(message.ts!) * 100),
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

export const convertToUser = (member: Member): User => ({
  user_id: member.id!,
  team_id: member.team_id!,
  real_name: member.real_name!,
  is_admin: member.is_admin!,
  is_owner: member.is_owner!,
  is_primary_owner: member.is_primary_owner!,
  is_restricted: member.is_restricted!,
  is_ultra_restricted: member.is_ultra_restricted!,
  is_app_user: member.is_app_user!,
  is_bot: member.is_bot!,
  deleted: member.deleted!,
});
