import { isExistsConfigFile } from "@/config";
import { editConfig, selectMenu } from "@/interactive";
import { Command, flags } from "@oclif/command";

export default class Hello extends Command {
  static description = "describe the command here";

  static examples = [
    `$ slst hello
hello world from ./src/hello.ts!
`,
  ];

  static flags = {
    help: flags.help({ char: "h" }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: "n", description: "name to print" }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: "f" }),
  };

  static args = [{ name: "file" }];

  async run() {
    if (isExistsConfigFile()) {
      // コンフィグファイルがある場合、メニュー
      selectMenu();
    } else {
      // コンフィグファイルがない場合、チュートリアル
      editConfig();
    }
  }
}
