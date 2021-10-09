slack-stock
===========



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/slack-stock.svg)](https://npmjs.org/package/slack-stock)
[![Downloads/week](https://img.shields.io/npm/dw/slack-stock.svg)](https://npmjs.org/package/slack-stock)
[![License](https://img.shields.io/npm/l/slack-stock.svg)](https://github.com/cli/slack-stock/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g slack-stock
$ slst COMMAND
running command...
$ slst (-v|--version|version)
slack-stock/0.0.0 linux-x64 node-v16.8.0
$ slst --help [COMMAND]
USAGE
  $ slst COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`slst hello [FILE]`](#slst-hello-file)
* [`slst help [COMMAND]`](#slst-help-command)

## `slst hello [FILE]`

describe the command here

```
USAGE
  $ slst hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ slst hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/cli/slack-stock/blob/v0.0.0/src/commands/hello.ts)_

## `slst help [COMMAND]`

display help for slst

```
USAGE
  $ slst help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.3/src/commands/help.ts)_
<!-- commandsstop -->
