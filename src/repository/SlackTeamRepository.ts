import { slack } from '~/lib/slack';

export const SlackTeamRepository = {
  info,
};

async function info(token: string) {
  const res = await slack.team.info({ token });

  if (res.team == null) throw new Error('An unexpected error has occurred.');

  return res.team;
}
