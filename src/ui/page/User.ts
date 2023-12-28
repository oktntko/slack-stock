import { filepath, output } from '~/middleware/output';
import { OutputFormatType } from '~/middleware/type';
import { TeamService } from '~/service/TeamService';
import { UserService } from '~/service/UserService';
import { SelectOutputFormatType } from '~/ui/component/SelectOutputFormatType';
import { SelectTeamList } from '~/ui/component/SelectTeamList';
import { Icon } from '~/ui/element/Icon';

export const User = {
  fetch,
  view,
};

async function fetch(options: { interactive: boolean; teamName?: string | undefined }) {
  const teamListAll = await TeamService.listTeam({}, [{ team_id: 'asc' }]);
  const teamList = options.teamName
    ? teamListAll.filter((team) => team.team_name === options.teamName)
    : options.interactive
      ? await SelectTeamList(teamListAll)
      : teamListAll;

  for (const { token } of teamList) {
    await UserService.fetchUser(token);
  }

  console.log(Icon.done, 'Success!');
}

async function view(options: {
  interactive: boolean;
  teamName?: string | undefined;
  output?: OutputFormatType;
}) {
  const teamListAll = await TeamService.listTeam({}, [{ team_id: 'asc' }]);
  const teamList = options.teamName
    ? teamListAll.filter((team) => team.team_name === options.teamName)
    : options.interactive
      ? await SelectTeamList(teamListAll)
      : teamListAll;

  const outputFormatType = options.output
    ? options.output
    : options.interactive
      ? await SelectOutputFormatType()
      : 'xlsx';

  const userList = await UserService.listUser(
    {
      team_id: { in: teamList.map((x) => x.team_id) },
      deleted: 0,
    },
    [{ team_id: 'asc' }, { is_admin: 'desc' }, { user_id: 'asc' }],
  );

  if (userList.length > 0) {
    await output(outputFormatType, userList, filepath('user', outputFormatType));
    console.log(Icon.success, 'Success!');
  } else {
    console.log(Icon.error, 'No data.');
  }
}
