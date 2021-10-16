import { Channel, Prisma, User } from "@prisma/client";
import { Message } from "@slack/web-api/dist/response/ConversationsHistoryResponse";
import { Channel as SlackChannel } from "@slack/web-api/dist/response/ConversationsListResponse";
import { Member } from "@slack/web-api/dist/response/UsersListResponse";

export const convertChannelFromSlackToStock = (
  channel: SlackChannel
): Channel => ({
  channel_id: channel.id!,
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
  is_admin: member.is_admin!,
  is_owner: member.is_owner!,
  is_primary_owner: member.is_primary_owner!,
  is_restricted: member.is_restricted!,
  is_ultra_restricted: member.is_ultra_restricted!,
  is_app_user: member.is_app_user!,
  is_bot: member.is_bot!,
  deleted: member.deleted!,
});
