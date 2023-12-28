import { Member } from '@slack/web-api/dist/response/UsersListResponse';
import { slack } from '~/lib/slack';

export const SlackUsersRepository = {
  list,
};

async function list(token: string) {
  const members: Member[] = [];

  for await (const res of slack.paginate('users.list', { token })) {
    if (res.members == null) throw new Error('An unexpected error has occurred.');

    members.push(...(res.members as Member[]));
  }

  return members;
}
