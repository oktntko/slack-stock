import { Prisma } from '@prisma/client';
import { Member } from '@slack/web-api/dist/response/UsersListResponse';
import { prisma } from '~/middleware/prisma';

export const DatabaseUserRepository = {
  findManyUser,
  findUniqueUser,
  upsertUser,
};

async function findManyUser(
  where?: Prisma.UserWhereInput,
  orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[],
  take?: number,
  skip?: number,
) {
  return prisma.user.findMany({
    include: {
      team: true,
    },
    where,
    orderBy,
    take,
    skip,
  });
}

async function findUniqueUser(where: Prisma.UserWhereUniqueInput) {
  return prisma.user.findUnique({
    include: {
      team: true,
    },
    where,
  });
}

async function upsertUser(member: Member) {
  return prisma.user.upsert({
    create: {
      user_id: member.id!,
      team_id: member.team_id!,
      user_name: member.real_name ?? member.name ?? 'deleted user',
      is_admin: Number(member.is_admin ?? false),
      is_owner: Number(member.is_owner ?? false),
      is_primary_owner: Number(member.is_primary_owner ?? false),
      is_restricted: Number(member.is_restricted ?? false),
      is_ultra_restricted: Number(member.is_ultra_restricted ?? false),
      is_app_user: Number(member.is_app_user),
      is_bot: Number(member.is_bot),
      deleted: Number(member.deleted),
    },
    update: {
      user_id: member.id!,
      team_id: member.team_id!,
      user_name: member.real_name ?? member.name ?? 'deleted user',
      is_admin: Number(member.is_admin ?? false),
      is_owner: Number(member.is_owner ?? false),
      is_primary_owner: Number(member.is_primary_owner ?? false),
      is_restricted: Number(member.is_restricted ?? false),
      is_ultra_restricted: Number(member.is_ultra_restricted ?? false),
      is_app_user: Number(member.is_app_user),
      is_bot: Number(member.is_bot),
      deleted: Number(member.deleted),
    },
    where: {
      user_id: member.id!,
    },
  });
}
