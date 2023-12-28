import { Prisma } from '@prisma/client';
import { DatabaseUserRepository } from '~/repository/DatabaseUserRepository';
import { SlackUsersRepository } from '~/repository/SlackUsersRepository';

export const UserService = {
  fetchUser,
  listUser,
};

async function fetchUser(token: string) {
  const memberList = await SlackUsersRepository.list(token);

  return Promise.all(memberList.map((member) => DatabaseUserRepository.upsertUser(member)));
}

async function listUser(
  where: Prisma.UserWhereInput,
  orderBy: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[],
  take?: number,
  skip?: number,
) {
  return DatabaseUserRepository.findManyUser(where, orderBy, take, skip);
}
