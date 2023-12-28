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

////////////////////////////////
// menu
////////////////////////////////
program
  //
  .action(Menu.open)
  //
  .command('fetch')
  .alias('f')
  .option('--no-interactive', 'If option is not set, default option enable.')
  .option('-t, --team-name <team name>', 'Enter team name (default: all teams)')
  .option('-c, --channel-name <channel name>', 'Enter channel name (default: all channels)')
  .option(
    '-f, --from <from>',
    'Enter period from. e.g. --from="YYYY-MM-DD". (default: 1st day one month ago from yesterday)',
    validateAndParseDate,
  )
  .option(
    '-t, --to <to>',
    'Enter period to. e.g. --to="YYYY-MM-DD". (default: today)',
    validateAndParseDate,
  )
  .action(Menu.fetch);

////////////////////////////////
// team
////////////////////////////////
const team = program.command('team');
team.command('add').argument('[token]', 'OAuth token installed your workspace').action(Team.add);
team
  .command('view')
  .option('--no-interactive', 'If option is not set, default option enable.')
  .addOption(OUTPUT_OPTION)
  .action(Team.view);

////////////////////////////////
// user
////////////////////////////////
const user = program.command('user');
user
  .command('fetch')
  .option('--no-interactive', 'If option is not set, default option enable.')
  .option('-t, --team-name <team name>', 'Enter team name (default: all teams)')
  .action(User.fetch);
user
  .command('view')
  .option('--no-interactive', 'If option is not set, default option enable.')
  .option('-t, --team-name <team name>', 'Enter team name (default: all teams)')
  .addOption(OUTPUT_OPTION)
  .action(User.view);

////////////////////////////////
// channel
////////////////////////////////
const channel = program.command('channel');
channel
  .command('fetch')
  .option('--no-interactive', 'If option is not set, default option enable.')
  .option('-t, --team-name <team name>', 'Enter team name (default: all teams)')
  .action(Channel.fetch);
channel
  .command('view')
  .option('--no-interactive', 'If option is not set, default option enable.')
  .option('-t, --team-name <team name>', 'Enter team name (default: all teams)')
  .addOption(OUTPUT_OPTION)
  .action(Channel.view);

////////////////////////////////
// message
////////////////////////////////
const message = program.command('message');
message
  .command('fetch')
  .option('--no-interactive', 'If option is not set, default option enable.')
  .option('-c, --channel-name <channel name>', 'Enter channel name (default: all channels)')
  .option(
    '-f, --from <from>',
    'Enter period from. e.g. --from="YYYY-MM-DD". (default: 1st day one month ago from yesterday)',
    validateAndParseDate,
  )
  .option(
    '-t, --to <to>',
    'Enter period to. e.g. --to="YYYY-MM-DD". (default: today)',
    validateAndParseDate,
  )
  .action(Message.fetch);
message
  .command('view')
  .option('--no-interactive', 'If option is not set, default option enable.')
  .option('-c, --channel-name <channel name>', 'Enter channel name (default: all channels)')
  .option(
    '-f, --from <from>',
    'Enter period from. e.g. --from="YYYY-MM-DD". (default: 1st day one month ago from yesterday)',
    validateAndParseDate,
  )
  .option(
    '-t, --to <to>',
    'Enter period to. e.g. --to="YYYY-MM-DD". (default: today)',
    validateAndParseDate,
  )
  .addOption(OUTPUT_OPTION)
  .action(Message.view);
message
  .command('stopwatch')
  .argument('[start keyword]', 'Enter start keyword. ex) --start-keyword="start".')
  .argument('[stop keyword]', 'Enter stop keyword. ex) --stop-keyword="stop".')
  .option('--no-interactive', 'If option is not set, default option enable.')
  .option('-c, --channel-name <channel name>', 'Enter channel name (default: all channels)')
  .option(
    '-f, --from <from>',
    'Enter period from. e.g. --from="YYYY-MM-DD". (default: 1st day one month ago from yesterday)',
    validateAndParseDate,
  )
  .option(
    '-t, --to <to>',
    'Enter period to. e.g. --to="YYYY-MM-DD". (default: today)',
    validateAndParseDate,
  )
  .addOption(OUTPUT_OPTION)
  .action(Message.stopwatch);

function validateAndParseDate(value: string) {
  const day = dayjs(value, 'YYYY-MM-DD', true);
  if (day.isValid()) {
    throw new commander.InvalidArgumentError('Got Invalid date. value=' + value);
  }
  return day;
}
