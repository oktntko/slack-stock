import { Argument, Command } from '@commander-js/extra-typings';
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

program.action(Menu.open);

program
  .command('team')
  .aliases(['t', 'teams'])
  .addArgument(new Argument('<action>').choices(['add', 'view'] as const))
  .option('-t, --token <token>', 'OAuth token installed your workspace')
  .addOption(OUTPUT_OPTION)
  .action(async (action, options) => {
    switch (action) {
      case 'add': {
        return Team.add(options);
      }
      case 'view': {
        return Team.view(options);
      }
    }
  });

program
  .command('user')
  .aliases(['u', 'users'])
  .addArgument(new Argument('<action>').choices(['fetch', 'view'] as const))
  .option('-t, --team-name <team name>', 'Enter team name')
  .addOption(OUTPUT_OPTION)
  .action(async (action, options) => {
    switch (action) {
      case 'fetch': {
        return User.fetch(options);
      }
      case 'view': {
        return User.view(options);
      }
    }
  });

program
  .command('channel')
  .aliases(['c', 'channels'])
  .addArgument(new Argument('<action>').choices(['fetch', 'view'] as const))
  .option('-t, --team-name <team name>', 'Enter team name')
  .addOption(OUTPUT_OPTION)
  .action(async (action, options) => {
    switch (action) {
      case 'fetch': {
        return Channel.fetch(options);
      }
      case 'view': {
        return Channel.view(options);
      }
    }
  });

program
  .command('message')
  .aliases(['m', 'messages'])
  .addArgument(new Argument('<action>').choices(['fetch', 'view'] as const))
  .option('-c, --channel-name <channel name>', 'Enter channel name')
  .option(
    '-f, --from <from>',
    'Enter period from. ex) --period="YYYY-MM-DD".',
    validateAndParseDate,
  )
  .option('-t, --to <to>', 'Enter period to. ex) --period="YYYY-MM-DD".', validateAndParseDate)
  .addOption(OUTPUT_OPTION)
  .action((action, options) => {
    switch (action) {
      case 'fetch': {
        return Message.fetch(options);
      }
      case 'view': {
        return Message.view(options);
      }
    }
  });

program
  .command('fetch')
  .alias('f')
  .option('-t, --team-name <team name>', 'Enter team name')
  .action(async (action, options) => {
    // switch (action) {
    //   case 'fetch': {
    //     return Team.add(options);
    //   }
    //   case 'view': {
    //     return Team.view(options);
    //   }
    // }
  });

function validateAndParseDate(value: string) {
  const day = dayjs(value, 'YYYY-MM-DD', true);
  if (day.isValid()) {
    throw new commander.InvalidArgumentError('Got Invalid date. value=' + value);
  }
  return day;
}
