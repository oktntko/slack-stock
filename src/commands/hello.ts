import { Command, flags } from "@oclif/command";
import { hello } from "../cui";

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
    await hello();
  }
}
