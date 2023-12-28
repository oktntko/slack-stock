import { Prisma } from '@prisma/client';
import { decrypt, encrypt } from '~/middleware/password';
import { DatabaseTeamRepository } from '~/repository/DatabaseTeamRepository';
import { SlackTeamRepository } from '~/repository/SlackTeamRepository';

export const TeamService = {
  upsertTeam,
  listTeam,
};

async function upsertTeam(token: string) {
  const team = await SlackTeamRepository.info(token);

  return DatabaseTeamRepository.upsertTeam({ ...team, token: encrypt(token) });
}

async function listTeam(
  where: Prisma.TeamWhereInput,
  orderBy: Prisma.TeamOrderByWithRelationInput | Prisma.TeamOrderByWithRelationInput[],
  take?: number,
  skip?: number,
) {
  const teamList = await DatabaseTeamRepository.findManyTeam(where, orderBy, take, skip);

  return teamList.map((team) => {
    team.token = decrypt(team.token);
    return team;
  });
}
