import { Prisma } from '@prisma/client';
import { Channel } from '@slack/web-api/dist/response/ConversationsListResponse';
import { prisma } from '~/middleware/prisma';

export const DatabaseChannelRepository = {
  findManyChannel,
  findUniqueChannel,
  upsertChannel,
};

async function findManyChannel(
  where?: Prisma.ChannelWhereInput,
  orderBy?: Prisma.ChannelOrderByWithRelationInput | Prisma.ChannelOrderByWithRelationInput[],
  take?: number,
  skip?: number,
) {
  return prisma.channel.findMany({
    include: {
      team: true,
    },
    where,
    orderBy,
    take,
    skip,
  });
}

async function findUniqueChannel(where: Prisma.ChannelWhereUniqueInput) {
  return prisma.channel.findUnique({
    include: {
      team: true,
    },
    where,
  });
}

async function upsertChannel(channel: Channel) {
  return prisma.channel.upsert({
    create: {
      channel_id: channel.id!,
      team_id: channel.context_team_id!,
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
    },
    update: {
      channel_id: channel.id!,
      team_id: channel.context_team_id!,
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
    },
    where: {
      channel_id: channel.id!,
    },
  });
}
