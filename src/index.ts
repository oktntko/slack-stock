import { Option, program } from '@commander-js/extra-typings';

program.name('mygit').version('1.0.0');

program
  .command('clone')
  .argument('<source>')
  .argument('[destination]')
  .option('--double-sided')
  .addOption(new Option('--drink-size <size>').choices(['small', 'medium', 'large'] as const))
  .description('clone a repository into a newly created directory')
  .action((source, destination, options) => {
    console.log('clone command called', source, destination, options);
  });

program
  .command('pull')
  .description('Fetch from and integrate with another repository or a local branch')
  .action((source, destination) => {
    console.log('pull command called', source, destination);
  });

program.parse(process.argv);

export {};
