import { filepath, output } from '~/middleware/output';
import { OutputFormatType } from '~/middleware/type';
import { ChannelService } from '~/service/ChannelService';
import { TeamService } from '~/service/TeamService';
import { SelectOutputFormatType } from '~/ui/component/SelectOutputFormatType';
import { Icon } from '~/ui/element/Icon';

export const Channel = {
  fetch,
  view,
};

async function fetch(options: { teamName?: string | undefined }) {
  const teamList = await TeamService.listTeam({ team_name: options.teamName }, [
    { team_id: 'asc' },
  ]);

  for (const { token } of teamList) {
    await ChannelService.fetchChannel(token);
  }

  console.log(Icon.done, 'Success!');
}

async function view(options: { teamName?: string | undefined; output?: OutputFormatType }) {
  const teamList = await TeamService.listTeam({ team_name: options.teamName }, [
    { team_id: 'asc' },
  ]);

  const outputFormatType = options.output ? options.output : await SelectOutputFormatType();

  const channelList = await ChannelService.listChannel(
    {
      team_id: { in: teamList.map((x) => x.team_id) },
      is_archived: 0,
    },
    [{ team_id: 'asc' }, { channel_id: 'asc' }],
  );

  if (channelList.length > 0) {
    await output(outputFormatType, channelList, filepath('channel', outputFormatType));
    console.log(Icon.success, 'Success!');
  } else {
    console.log(Icon.error, 'No data.');
  }
}
