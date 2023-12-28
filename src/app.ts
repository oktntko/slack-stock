import { Command } from '@commander-js/extra-typings';
import commander from 'commander';
import dayjs from 'dayjs';
import { OUTPUT_OPTION } from '~/middleware/type';
import { Channel } from '~/ui/page/Channel';
import { Menu } from '~/ui/page/Menu';
import { Message } from '~/ui/page/Message';
import { Team } from '~/ui/page/Team';
import { User } from '~/ui/page/User';

export const program = new Command();

program
  .name('slack-stock')
  .description('CLI to stock Slack data in your DB (SQLite).')
  .alias('slst')
  .version('0.2.0');

program
  //
  .action(Menu.open)
  //
  .command('fetch')
  .alias('f')
  .option('-t, --team-name <team name>', 'Enter team name')
  .option('-c, --channel-name <channel name>', 'Enter channel name')
  .option('-f, --from <from>', 'Enter period from. ex) --from="YYYY-MM-DD".', validateAndParseDate)
  .option('-t, --to <to>', 'Enter period to. ex) --to="YYYY-MM-DD".', validateAndParseDate)
  .action(Menu.fetch);

program
  .command('team')
  //
  .command('add')
  .option('-t, --token <token>', 'OAuth token installed your workspace')
  .action(Team.add)
  //
  .command('view')
  .option('-t, --token <token>', 'OAuth token installed your workspace')
  .addOption(OUTPUT_OPTION)
  .action(Team.view);

program
  .command('user')
  //
  .command('fetch')
  .option('-t, --team-name <team name>', 'Enter team name')
  .action(User.fetch)
  //
  .command('view')
  .option('-t, --team-name <team name>', 'Enter team name')
  .addOption(OUTPUT_OPTION)
  .action(User.view);

program
  .command('channel')
  //
  .command('fetch')
  .option('-t, --team-name <team name>', 'Enter team name')
  .action(Channel.fetch)
  //
  .command('view')
  .option('-t, --team-name <team name>', 'Enter team name')
  .addOption(OUTPUT_OPTION)
  .action(Channel.view);

program
  .command('message')
  //
  .command('fetch')
  .option('-c, --channel-name <channel name>', 'Enter channel name')
  .option('-f, --from <from>', 'Enter period from. ex) --from="YYYY-MM-DD".', validateAndParseDate)
  .option('-t, --to <to>', 'Enter period to. ex) --to="YYYY-MM-DD".', validateAndParseDate)
  .action(Message.fetch)
  //
  .command('view')
  .option('-c, --channel-name <channel name>', 'Enter channel name')
  .option('-f, --from <from>', 'Enter period from. ex) --from="YYYY-MM-DD".', validateAndParseDate)
  .option('-t, --to <to>', 'Enter period to. ex) --to="YYYY-MM-DD".', validateAndParseDate)
  .addOption(OUTPUT_OPTION)
  .action(Message.view);

function validateAndParseDate(value: string) {
  const day = dayjs(value, 'YYYY-MM-DD', true);
  if (day.isValid()) {
    throw new commander.InvalidArgumentError('Got Invalid date. value=' + value);
  }
  return day;
}
