import { Prisma } from '@prisma/client';
import { DatabaseChannelRepository } from '~/repository/DatabaseChannelRepository';
import { SlackConversationsRepository } from '~/repository/SlackConversationsRepository';

export const ChannelService = {
  fetchChannel,
  listChannel,
};

async function fetchChannel(token: string) {
  const channelList = await SlackConversationsRepository.list(token);

  return channelList.map((channel) => DatabaseChannelRepository.upsertChannel(channel));
}

async function listChannel(
  where: Prisma.ChannelWhereInput,
  orderBy: Prisma.ChannelOrderByWithRelationInput | Prisma.ChannelOrderByWithRelationInput[],
  take?: number,
  skip?: number,
) {
  return DatabaseChannelRepository.findManyChannel(where, orderBy, take, skip);
}
