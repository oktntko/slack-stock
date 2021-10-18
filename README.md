# slack-stock

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/slack-stock.svg)](https://npmjs.org/package/slack-stock)
[![Downloads/week](https://img.shields.io/npm/dw/slack-stock.svg)](https://npmjs.org/package/slack-stock)
[![License](https://img.shields.io/npm/l/slack-stock.svg)](https://github.com/cli/slack-stock/blob/master/package.json)

<!-- toc -->
* [slack-stock](#slack-stock)
* [Usage](#usage)
* [Commands](#commands)
* [Slack App](#slack-app)
* [Slack Api](#slack-api)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g slack-stock
$ slst COMMAND
running command...
$ slst (-v|--version|version)
slack-stock/0.0.0 linux-x64 node-v14.15.3
$ slst --help [COMMAND]
USAGE
  $ slst COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`slst config [FILE]`](#slst-config-file)
* [`slst help [COMMAND]`](#slst-help-command)

## `slst config [FILE]`

describe the command here

```
USAGE
  $ slst config [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/config.ts](https://github.com/cli/slack-stock/blob/v0.0.0/src/commands/config.ts)_

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

# Slack App

- Create an App
- From scratch
- Create an App
- OAuth & Permissions
- Scopes
- User Token Scopes
  - channels:read
  - channels:history
  - users:read
  - users.profile:read
- OAuth Tokens for Your Workspace
  - Install to Workspace
- OAuth Tokens for Your Workspace
- Copy User OAuth Token

# Slack Api

## チャンネルリスト

conversations.list
https://api.slack.com/methods/conversations.list

## 会話ログ

conversations.history
https://api.slack.com/methods/conversations.history

## ユーザリスト

users.list
https://api.slack.com/methods/users.list

## プロフィール

users.profile.get
https://api.slack.com/methods/users.profile.get
