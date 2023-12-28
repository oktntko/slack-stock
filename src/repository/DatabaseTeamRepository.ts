import { Prisma } from '@prisma/client';
import { Team } from '@slack/web-api/dist/response/TeamInfoResponse';
import { prisma } from '~/middleware/prisma';

export const DatabaseTeamRepository = {
  findManyTeam,
  findUniqueTeam,
  upsertTeam,
};

async function findManyTeam(
  where?: Prisma.TeamWhereInput,
  orderBy?: Prisma.TeamOrderByWithRelationInput | Prisma.TeamOrderByWithRelationInput[],
  take?: number,
  skip?: number,
) {
  return prisma.team.findMany({
    where,
    orderBy,
    take,
    skip,
  });
}

async function findUniqueTeam(where: Prisma.TeamWhereUniqueInput) {
  return prisma.team.findUnique({
    where,
  });
}

async function upsertTeam(team: Team & { token: string }) {
  return prisma.team.upsert({
    create: {
      team_id: team.id!,
      team_name: team.name!,
      token: team.token,
    },
    update: {
      team_id: team.id!,
      team_name: team.name!,
      token: team.token,
    },
    where: {
      team_id: team.id!,
    },
  });
}
