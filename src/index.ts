import { Command } from "@commander-js/extra-typings";

const program = new Command()
  .argument("<string>")
  .option("--first")
  .option("-s, --separator <char>")
  .action((str, options) => {
    const limit = options.first ? 1 : undefined;
    console.log(str.split(options.separator ?? "/", limit));
  });

program.parse();
