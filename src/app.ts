import { Argument, Command } from '@commander-js/extra-typings';
import { OUTPUT_OPTION } from './middleware/type';

export const program = new Command();

program
  .name('slack-stock')
  .description('CLI to stock Slack data in your DB (SQLite).')
  .alias('slst')
  .version('0.2.0');

program.action(() => {
  console.log('menu');
});

program
  .command('teams')
  .aliases(['t', 'team'])
  .addArgument(new Argument('<action>').choices(['add', 'view']))
  .option('-t, --token <token>', 'OAuth token installed your workspace')
  .addOption(OUTPUT_OPTION)
  .action((action, options) => {
    console.log('teams', action, options);
  });

program
  .command('data')
  .alias('d')
  .addOption(OUTPUT_OPTION)
  .option('-t, --team <team name>', 'Enter team name')
  .action((options) => {
    console.log('data', options);
  });

program
  .command('messages')
  .aliases(['m', 'message'])
  .option('-c, --channel <channel name>', 'Enter channel name')
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
