import { type Dayjs } from 'dayjs';
import { color } from '~/lib/color';
import { Confirm } from '~/ui/component/Confirm';
import { SelectAction } from '~/ui/component/SelectAction';
import { Channel } from '~/ui/page/Channel';
import { Message } from '~/ui/page/Message';
import { User } from '~/ui/page/User';
import { Team } from './Team';

export const Menu = {
  open,
  fetch,
};

async function open() {
  for (;;) {
    const action = await SelectAction();
    switch (action) {
      case 'message-fetch':
        await Message.fetch({ interactive: true });
        break;
      case 'message-view':
        await Message.view({ interactive: true });
        break;
      case 'message-search':
        await Message.search();
        break;
      case 'message-stopwatch':
        await Message.stopwatch('', '', { interactive: true });
        break;
      case 'data-fetch':
        await fetch({ interactive: true });
        break;
      case 'team-add':
        await Team.add('');
        break;
      case 'team-view':
        await Team.view({ interactive: true });
        break;
      case 'user-fetch':
        await User.fetch({ interactive: true });
        break;
      case 'user-view':
        await User.view({ interactive: true });
        break;
      case 'channel-fetch':
        await Channel.fetch({ interactive: true });
        break;
      case 'channel-view':
        await Channel.view({ interactive: true });
        break;
    }

    if (!(await Confirm('continue?'))) {
      console.log(color.info('👋 Bye!'));
      break;
    }
  }
}

async function fetch(options: {
  interactive: boolean;
  teamName?: string | undefined;
  channelName?: string | undefined;
  from?: Dayjs | undefined;
  to?: Dayjs | undefined;
}) {
  await Channel.fetch(options);
  await User.fetch(options);
  await Message.fetch(options);
}
