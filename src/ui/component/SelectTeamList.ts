import inquirer from 'inquirer';
import { TeamService } from '~/service/TeamService';
import { Icon } from '~/ui/element/Icon';

type Team = Awaited<ReturnType<typeof TeamService.listTeam>>[number];

export async function SelectTeamList(teamList: Team[]) {
  const { checkbox } = await inquirer.prompt<{ checkbox: Team[] }>([
    {
      type: 'checkbox',
      name: 'checkbox',
      prefix: Icon.question,
      message: 'Select team',
      choices: teamList.map((team) => ({
        name: team.team_name,
        value: team,
      })),
      pageSize: Math.min(15, teamList.length),
    },
  ]);

  return checkbox;
}
