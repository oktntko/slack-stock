import inquirer from 'inquirer';
import { color } from '~/lib/color';
import { ChannelService } from '~/service/ChannelService';
import { Icon } from '~/ui/element/Icon';

type Channel = Awaited<ReturnType<typeof ChannelService.listChannel>>[number];

export async function SelectChannelList(channelList: Channel[]) {
  const { checkbox } = await inquirer.prompt<{ checkbox: Channel[] }>([
    {
      type: 'checkbox',
      name: 'checkbox',
      prefix: Icon.question,
      message: 'Select channel',
      choices: channelList.map((channel) => ({
        name: `${color.dim(channel.team.team_name)} ${channel.is_private ? '🔒' : '♯ '}${color.bold(
          channel.channel_name,
        )}`,
        value: channel,
      })),
      pageSize: Math.min(15, channelList.length),
    },
  ]);

  return checkbox;
}
