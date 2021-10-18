import { config, isExistsConfigFile } from "@/commands/config";
import { contact } from "@/commands/contact";
import { fetch } from "@/commands/fetch";
import { output } from "@/commands/output";
import { selectMenu } from "@/interactive";
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
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: "n", description: "name to print" }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: "f" }),
  };

  static args = [{ name: "file" }];

  async run() {
    if (isExistsConfigFile()) {
      // コンフィグファイルがある場合、メニュー
      const menu = await selectMenu();
      switch (menu) {
        case "fetch":
          await fetch();
          return;
        case "output":
          await output();
          return;
        case "config":
          await config();
          return;
        case "tutorial":
        case "contact":
          contact();
          return;
        case "exit":
          this.exit();
      }
    } else {
      // コンフィグファイルがない場合、チュートリアル
      // TODO
    }
  }
}
