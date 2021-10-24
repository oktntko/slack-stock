import { Command, flags } from "@oclif/command";
import { hello, tutorial } from "../commands";
import { isExistsConfigFile } from "../utils";

export default class Hello extends Command {
  static aliases = [""];
  static description = "Select menu";

  static examples = [
    `$ slst hello
hello world from ./src/hello.ts!
`,
  ];

  static flags = {
    help: flags.help({ char: "h" }),
  };

  async run() {
    if (isExistsConfigFile()) {
      await hello();
    } else {
      await tutorial();
    }
  }

  async catch(err: any) {
    console.log(err);
  }
}
