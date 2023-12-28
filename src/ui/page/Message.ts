import dayjs from 'dayjs';
import util from 'node:util';
import { color } from '~/lib/color';
import { filepath, output } from '~/middleware/output';
import { OutputFormatType } from '~/middleware/type';
import { ChannelService } from '~/service/ChannelService';
import { MessageService } from '~/service/MessageService';
import { Icon } from '~/ui//element/Icon';
import { InputDate } from '~/ui/component/InputDate';
import { SelectChannelList } from '~/ui/component/SelectChannelList';
import { SelectOutputFormatType } from '~/ui/component/SelectOutputFormatType';
import { Autocomplete } from '../component/Autocomplete';
import { InputText } from '../component/InputText';

export const Message = {
  fetch,
  view,
  stopwatch,
  search,
};

async function fetch(options: {
  interactive: boolean;
  channelName?: string | undefined;
  from?: dayjs.Dayjs | undefined;
  to?: dayjs.Dayjs | undefined;
}) {
  const channelListAll = await ChannelService.listChannel({ is_archived: 0 }, [
    { team_id: 'asc' },
    { channel_id: 'asc' },
  ]);
  const channelList = options.channelName
    ? channelListAll.filter((channel) => channel.channel_name === options.channelName)
    : options.interactive
      ? await SelectChannelList(channelListAll)
      : channelListAll;

  const from = options.from
    ? options.from
    : options.interactive
      ? await InputDate('Select period "from" date', dayjs().subtract(1, 'day').startOf('month'))
      : dayjs().subtract(1, 'day').startOf('month');
  const to = options.to
    ? options.to
    : options.interactive
      ? await InputDate('Select period "to" date', dayjs())
      : dayjs();

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
  interactive: boolean;
  channelName?: string | undefined;
  from?: dayjs.Dayjs | undefined;
  to?: dayjs.Dayjs | undefined;
  output?: OutputFormatType;
}) {
  const channelListAll = await ChannelService.listChannel({ is_archived: 0 }, [
    { team_id: 'asc' },
    { channel_id: 'asc' },
  ]);
  const channelList = options.channelName
    ? channelListAll.filter((channel) => channel.channel_name === options.channelName)
    : options.interactive
      ? await SelectChannelList(channelListAll)
      : channelListAll;

  const from = options.from
    ? options.from
    : options.interactive
      ? await InputDate('Select period "from" date', dayjs().subtract(1, 'day').startOf('month'))
      : dayjs().subtract(1, 'day').startOf('month');
  const to = options.to
    ? options.to
    : options.interactive
      ? await InputDate('Select period "to" date', dayjs())
      : dayjs();

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

  const outputFormatType = options.output
    ? options.output
    : options.interactive
      ? await SelectOutputFormatType()
      : 'xlsx';

  if (messageList.length > 0) {
    await output(outputFormatType, messageList, filepath('message', outputFormatType, from, to));
    console.log(Icon.success, 'Success!');
  } else {
    console.log(Icon.error, 'No data.');
  }
}

async function stopwatch(
  argStartKeyword: string | undefined,
  argStopKeyword: string | undefined,
  options: {
    interactive: boolean;
    channelName?: string | undefined;
    from?: dayjs.Dayjs | undefined;
    to?: dayjs.Dayjs | undefined;
    output?: OutputFormatType;
  },
) {
  const channelListAll = await ChannelService.listChannel({ is_archived: 0 }, [
    { team_id: 'asc' },
    { channel_id: 'asc' },
  ]);
  const channelList = options.channelName
    ? channelListAll.filter((channel) => channel.channel_name === options.channelName)
    : options.interactive
      ? await SelectChannelList(channelListAll)
      : channelListAll;

  const from = options.from
    ? options.from
    : options.interactive
      ? await InputDate('Select period "from" date', dayjs().subtract(1, 'day').startOf('month'))
      : dayjs().subtract(1, 'day').startOf('month');
  const to = options.to
    ? options.to
    : options.interactive
      ? await InputDate('Select period "to" date', dayjs())
      : dayjs();

  const startKeyword = argStartKeyword ? argStartKeyword : await InputText('Enter start keyword');
  const stopKeyword = argStopKeyword ? argStopKeyword : await InputText('Enter stop  keyword');

  const messageList = await MessageService.listMessageByStopwatchKeyword({
    channelIdList: channelList.map((x) => x.channel_id),
    from,
    to,
    startKeyword,
    stopKeyword,
  });

  const outputFormatType = options.output
    ? options.output
    : options.interactive
      ? await SelectOutputFormatType()
      : 'xlsx';

  if (messageList.length > 0) {
    await output(outputFormatType, messageList, filepath('message', outputFormatType, from, to));
    console.log(Icon.success, 'Success!');
  } else {
    console.log(Icon.error, 'No data.');
  }
}

async function search() {
  const answer = await Autocomplete({
    message: 'find',
    source: async (input) => {
      const messageList = await MessageService.searchMessage(input);
      return messageList.map((message) => {
        const name = `${message.time_tz} | ${message.team_name} | ${message.channel_name} | ${
          message.user_name
        } | ${color.bold(message.text.replaceAll('\n', color.dim('↓ ')))}`;

        return {
          name,
          value: message,
        };
      });
    },
    pageSize: 20,
  });

  console.log(util.inspect(answer, { showHidden: false, depth: null, colors: true }));
}
