import { filepath, output } from '~/middleware/output';
import { OutputFormatType } from '~/middleware/type';
import { TeamService } from '~/service/TeamService';
import { UserService } from '~/service/UserService';
import { SelectOutputFormatType } from '~/ui/component/SelectOutputFormatType';
import { Icon } from '~/ui/element/Icon';
import { Message } from '~/ui/element/Message';

export const User = {
  fetch,
  view,
};

async function fetch(options: { teamName?: string | undefined }) {
  const teamList = await TeamService.listTeam({ team_name: options.teamName }, [
    { team_id: 'asc' },
  ]);

  for (const { token } of teamList) {
    await UserService.fetchUser(token);
  }

  console.info(Icon.done, Message.success);
}

async function view(options: { teamName?: string | undefined; output?: OutputFormatType }) {
  const teamList = await TeamService.listTeam({ team_name: options.teamName }, [
    { team_id: 'asc' },
  ]);

  const outputFormatType = options.output ? options.output : await SelectOutputFormatType();

  const userList = await UserService.listUser(
    {
      team_id: { in: teamList.map((x) => x.team_id) },
      deleted: 0,
    },
    [{ team_id: 'asc' }, { is_admin: 'desc' }, { user_id: 'asc' }],
  );

  if (userList.length > 0) {
    await output(outputFormatType, userList, filepath('user', outputFormatType));
    console.log(Message.success);
  } else {
    console.log(Message.no_data);
  }
}
