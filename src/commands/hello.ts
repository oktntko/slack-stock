import { hello } from "@/commands";
import { isExistsConfigFile } from "@/utils";
import { Command, flags } from "@oclif/command";

export default class Hello extends Command {
  static aliases = [""];
  static description = "describe the command here";

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
      // TODO: コンフィグファイルがない場合、チュートリアル
    }
  }
}
