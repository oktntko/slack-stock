import { color } from '~/lib/color';
import { filepath, output } from '~/middleware/output';
import { OutputFormatType } from '~/middleware/type';
import { TeamService } from '~/service/TeamService';
import { InputKeyword } from '~/ui//component/InputKeyword';
import { Icon } from '~/ui/element/Icon';
import { SelectOutputFormatType } from '../component/SelectOutputFormatType';

export const Team = {
  add,
  view,
};

async function add(options: { token?: string | undefined }) {
  // token が入力されていない場合、token の取得方法を表示する
  const token = options.token
    ? options.token
    : await (async () => {
        console.info('📥 Please setup slack app and copy token');

        console.info(color.link('https://github.com/oktntko/slack-stock#setup-slack-app'));

        return InputKeyword('What is your token?');
      })();

  // Team を登録する
  const team = await TeamService.upsertTeam(token);

  // 各データを登録する
  // TODO
  // await COMMANDS.data.fetch(team);

  console.log(
    Icon.done,
    `Finish! Have a great Slack Life with slack-stock! Try to command "${color.info(
      'slst messages stock',
    )}", next "${color.info('slst messages view')}"".`,
  );
}

async function view(options: { output?: OutputFormatType }) {
  const outputFormatType = options.output ? options.output : await SelectOutputFormatType();

  const teamList = await TeamService.listTeam({}, [{ team_id: 'asc' }]);

  if (teamList.length > 0) {
    await output(outputFormatType, teamList, filepath('team', outputFormatType));
    console.log(Icon.success, 'Success!');
  } else {
    console.log(Icon.error, 'No data.');
  }
}
