import { Prisma } from '@prisma/client';
import { DatabaseTeamRepository } from '~/repository/DatabaseTeamRepository';
import { SlackTeamRepository } from '~/repository/SlackTeamRepository';

export const TeamService = {
  upsertTeam,
  listTeam,
};

async function upsertTeam(token: string) {
  const team = await SlackTeamRepository.info(token);

  return DatabaseTeamRepository.upsertTeam({ ...team, token });
}

async function listTeam(
  where: Prisma.TeamWhereInput,
  orderBy: Prisma.TeamOrderByWithRelationInput | Prisma.TeamOrderByWithRelationInput[],
  take?: number,
  skip?: number,
) {
  return DatabaseTeamRepository.findManyTeam(where, orderBy, take, skip);
}
