import { Argument, Command } from '@commander-js/extra-typings';
import { OUTPUT_OPTION } from '~/middleware/type';
import { Menu } from '~/ui/page/Menu';
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
  .command('message')
  .aliases(['m', 'messages'])
  .option('-c, --channel-name <channel name>', 'Enter channel name')
  .option('-d, --day', 'If this flag ON, period is from one day ago to now.')
  .option('-w, --week', 'If this flag ON, period is from one week ago to now.')
  .option('-m, --month', 'If this flag ON, period is from one month ago to now.')
  .option('-pf, --period-from <from>', 'Enter period from. ex) --period="YYYY-MM-DD".')
  .option('-pt, --period-to <to>', 'Enter period to. ex) --period="YYYY-MM-DD".')
  .option('-k, --keyword <keyword>', 'Enter timer keyword. ex) --keyword="start" "stop".')
  .addOption(OUTPUT_OPTION)
  .action((options) => {
    console.log('messages', options);
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
