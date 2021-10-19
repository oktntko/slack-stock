import { Channel, Prisma, User } from "@prisma/client";
import { Message } from "@slack/web-api/dist/response/ConversationsHistoryResponse";
import { Channel as SlackChannel } from "@slack/web-api/dist/response/ConversationsListResponse";
import { Member } from "@slack/web-api/dist/response/UsersListResponse";

export const convertChannelFromSlackToStock = (
  channel: SlackChannel
): Channel => ({
  channel_id: channel.id!,
  name: channel.name!,
  is_channel: Number(channel.is_channel),
  is_group: Number(channel.is_group),
  is_im: Number(channel.is_im),
  is_mpim: Number(channel.is_mpim),
  is_private: Number(channel.is_private),
  is_archived: Number(channel.is_archived),
  is_general: Number(channel.is_general),
  is_shared: Number(channel.is_shared),
  is_org_shared: Number(channel.is_org_shared),
  is_pending_ext_shared: Number(channel.is_pending_ext_shared),
  is_ext_shared: Number(channel.is_ext_shared),
});

export const convertMessageFromSlackToStock = (
  channel_id: string,
  message: Message
): Prisma.MessageUncheckedCreateInput => ({
  channel_id: channel_id,
  user_id: message.user!,
  ts: message.ts!,
  type: message.type!,
  text: message.text!,
});

export const convertUserFromSlackToStock = (member: Member): User => ({
  user_id: member.id!,
  team_id: member.team_id!,
  real_name: member.real_name!,
  is_admin: Number(member.is_admin),
  is_owner: Number(member.is_owner),
  is_primary_owner: Number(member.is_primary_owner),
  is_restricted: Number(member.is_restricted),
  is_ultra_restricted: Number(member.is_ultra_restricted),
  is_app_user: Number(member.is_app_user),
  is_bot: Number(member.is_bot),
  deleted: Number(member.deleted),
});
