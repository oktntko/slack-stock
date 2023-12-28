import { color } from '~/lib/color';
import { $loading } from '~/lib/loading';
import { filepath, output } from '~/middleware/output';
import { TeamService } from '~/service/TeamService';
import { InputText } from '~/ui//component/InputText';
import { SelectOutputFormatType } from '~/ui/component/SelectOutputFormatType';
import { Icon } from '~/ui/element/Icon';
import { Menu } from '~/ui/page/Menu';

export const Team = {
  add,
  view,
};

async function add(argToken: string | undefined) {
  // token が入力されていない場合、token の取得方法を表示する
  const token = argToken
    ? argToken
    : await (async () => {
        console.info('📥 Please setup slack app and copy token');
        console.info(color.link('https://github.com/oktntko/slack-stock#setup-slack-app'));

        return InputText('What is your token?');
      })();

  // Team を登録する
  const loading = $loading.start();
  const team = await TeamService.upsertTeam(token);
  loading.stop();

  // 各データを登録する
  await Menu.fetch({
    interactive: false,
    teamName: team.team_name,
  });

  console.log(
    Icon.done,
    `Finish! Have a great Slack Life with slack-stock! Try to command "${color.info(
      'slst messages stock',
    )}", next "${color.info('slst messages view')}"".`,
  );
}

async function view(options: { interactive: boolean; outputFormat?: 'console' | 'csv' | 'xlsx' }) {
  const loading = $loading.start();
  const teamList = await TeamService.listTeam({}, [{ team_id: 'asc' }]);
  loading.stop();

  const outputFormat = options.outputFormat
    ? options.outputFormat
    : options.interactive
      ? await SelectOutputFormatType()
      : 'xlsx';

  if (teamList.length > 0) {
    const loading = $loading.start();
    await output(outputFormat, teamList, filepath('team', outputFormat));
    loading.stop();
    console.log(Icon.success, 'Success!');
  } else {
    console.log(Icon.error, 'No data.');
  }
}
