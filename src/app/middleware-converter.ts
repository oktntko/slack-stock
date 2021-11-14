/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Channel, Prisma, Team, User } from "@prisma/client";
import { Message } from "@slack/web-api/dist/response/ConversationsHistoryResponse";
import { Channel as SlackChannel } from "@slack/web-api/dist/response/ConversationsListResponse";
import { Team as SlackTeam } from "@slack/web-api/dist/response/TeamInfoResponse";
import { Member } from "@slack/web-api/dist/response/UsersListResponse";
import dayjs from "dayjs";

export const CONVERTER = {
  team: {
    convert(team: SlackTeam & { token: string }): Team {
      return {
        team_id: team.id!,
        team_name: team.name!,
        token: team.token,
      };
    },
  },
  user: {
    convert(member: Member): User {
      return {
        user_id: member.id!,
        team_id: member.team_id!,
        user_name: member.real_name!,
        is_admin: Number(member.is_admin),
        is_owner: Number(member.is_owner),
        is_primary_owner: Number(member.is_primary_owner),
        is_restricted: Number(member.is_restricted),
        is_ultra_restricted: Number(member.is_ultra_restricted),
        is_app_user: Number(member.is_app_user),
        is_bot: Number(member.is_bot),
        deleted: Number(member.deleted),
      };
    },
  },
  channel: {
    convert(channel: SlackChannel & { team_id: string }): Channel {
      return {
        channel_id: channel.id!,
        team_id: channel.team_id,
        channel_name: channel.name!,
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
      };
    },
  },
  message: {
    convert(message: Message & { team_id: string; channel_id: string }): Prisma.MessageUncheckedCreateInput {
      return {
        team_id: message.team_id,
        channel_id: message.channel_id,
        user_id: message.user!,
        ts: message.ts!,
        date_tz: dayjs.unix(Number(message.ts!)).format("YYYY-MM-DD"),
        time_tz: dayjs.unix(Number(message.ts!)).format("YYYY-MM-DD hh:mm:ss"),
        type: message.type!,
        text: message.text!,
      };
    },
  },
};
