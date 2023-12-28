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

program
  .command('team')
  //
  .command('add')
  .argument('[token]', 'OAuth token installed your workspace')
  .action(Team.add)
  //
  .command('view')
  .option('--no-interactive', 'If option is not set, default option enable.')
  .addOption(OUTPUT_OPTION)
  .action(Team.view);

program
  .command('user')
  //
  .command('fetch')
  .option('--no-interactive', 'If option is not set, default option enable.')
  .option('-t, --team-name <team name>', 'Enter team name (default: all teams)')
  .action(User.fetch)
  //
  .command('view')
  .option('--no-interactive', 'If option is not set, default option enable.')
  .option('-t, --team-name <team name>', 'Enter team name (default: all teams)')
  .addOption(OUTPUT_OPTION)
  .action(User.view);

program
  .command('channel')
  //
  .command('fetch')
  .option('--no-interactive', 'If option is not set, default option enable.')
  .option('-t, --team-name <team name>', 'Enter team name (default: all teams)')
  .action(Channel.fetch)
  //
  .command('view')
  .option('--no-interactive', 'If option is not set, default option enable.')
  .option('-t, --team-name <team name>', 'Enter team name (default: all teams)')
  .addOption(OUTPUT_OPTION)
  .action(Channel.view);

program
  .command('message')
  //
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
  .action(Message.fetch)
  //
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
  .action(Message.view)
  //
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
  .action(Message.timer);

function validateAndParseDate(value: string) {
  const day = dayjs(value, 'YYYY-MM-DD', true);
  if (day.isValid()) {
    throw new commander.InvalidArgumentError('Got Invalid date. value=' + value);
  }
  return day;
}
