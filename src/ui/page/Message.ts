import dayjs from 'dayjs';
import { filepath, output } from '~/middleware/output';
import { OutputFormatType } from '~/middleware/type';
import { ChannelService } from '~/service/ChannelService';
import { MessageService } from '~/service/MessageService';
import { Icon } from '~/ui//element/Icon';
import { InputDate } from '~/ui/component/InputDate';
import { SelectOutputFormatType } from '~/ui/component/SelectOutputFormatType';

export const Message = {
  fetch,
  view,
};

async function fetch(options: {
  channelName?: string | undefined;
  from?: dayjs.Dayjs | undefined;
  to?: dayjs.Dayjs | undefined;
}) {
  const channelList = await ChannelService.listChannel(
    { channel_name: options.channelName, is_archived: 0 },
    [{ team_id: 'asc' }, { channel_id: 'asc' }],
  );
  const from = options.from
    ? options.from
    : await InputDate('Select period "from" date', dayjs().subtract(1, 'day').startOf('month'));
  const to = options.to ? options.to : await InputDate('Select period "to" date', dayjs());

  for (const {
    team_id,
    team: { token },
    channel_id,
  } of channelList) {
    await MessageService.fetchMessage(team_id, token, channel_id, from, to);
  }

  console.log(Icon.done, 'Success!');
}

async function view(options: {
  channelName?: string | undefined;
  from?: dayjs.Dayjs | undefined;
  to?: dayjs.Dayjs | undefined;
  output?: OutputFormatType;
}) {
  const channelList = await ChannelService.listChannel(
    { channel_name: options.channelName, is_archived: 0 },
    [{ team_id: 'asc' }, { channel_id: 'asc' }],
  );
  const from = options.from
    ? options.from
    : await InputDate('Select period "from" date', dayjs().subtract(1, 'day').startOf('month'));
  const to = options.to ? options.to : await InputDate('Select period "to" date', dayjs());
  const outputFormatType = options.output ? options.output : await SelectOutputFormatType();

  const messageList = await MessageService.listMessage(
    {
      channel_id: { in: channelList.map((x) => x.channel_id) },
      ts: {
        gte: String(from.unix()),
        lte: String(to.unix()),
      },
    },
    [{ team_id: 'asc' }, { channel_id: 'asc' }],
  );

  if (messageList.length > 0) {
    await output(outputFormatType, messageList, filepath('message', outputFormatType, from, to));
    console.log(Icon.success, 'Success!');
  } else {
    console.log(Icon.error, 'No data.');
  }
}
