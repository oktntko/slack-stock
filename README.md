# slack-stock

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/slack-stock.svg)](https://npmjs.org/package/slack-stock)
[![Downloads/week](https://img.shields.io/npm/dw/slack-stock.svg)](https://npmjs.org/package/slack-stock)
[![License](https://img.shields.io/npm/l/slack-stock.svg)](https://github.com/cli/slack-stock/blob/master/package.json)

<!-- toc -->

- [slack-stock](#slack-stock)
- [About](#about)
- [Introduction](#introduction)
- [Installation](#installation)
- [Tutorial](#tutorial)
- [Commands](#commands)
- [Program Resources](#program-resources)
<!-- tocstop -->

# About

Ever wanted to see your Slack messages in tabular format?  
This app can stock Slack data in your DB (SQLite) with some setup. And you can view the data in various supported formats (Excel, Csv, Tsv, Console).  
And best of all, this app is a command line tool. This means that you can accumulate data on a daily basis by performing scheduled executions (cron for Linux, task manager for Windows). It will make your Slack Life more brilliant.  
Have a great Slack Life with slack-stock!

# Introduction

- stock => view(console)
- cron => stock => after 1 month => view(file)

# Installation

<!-- installation -->

- [`Setup Slack App`](#setup-slack-app)
- [`Install slack-stock`](#install-slack-stock)
  - [`Linux Installation`](#linux-installation)
  - [`Windows Installation`](#windows-installation)

## Setup Slack App

Are you a workspace owner? Otherwise, the procedure will be difficult in the future.
If you want to improve your workspace, ask the owner to empower you.

- [`Create an App`](#create-an-app)
- [`From scratch`](#choose-from-scratch)
- [`Name app & choose workspace`](#name-app--choose-workspace)
- [`OAuth & Permissions`](#oauth--permissions)
- [`User Token Scopes`](#user-token-scopes)
- [`Install to Workspace`](#install-to-workspace)

### Create an App

First of all, create an APP with [Spack App](https://api.slack.com/apps)

<center>

![01.Create_an_App](docs/images/01.Create_an_App.png)

</center>

### Choose From scratch

<center>

![02.From_scratch](docs/images/02.From_scratch.png)

</center>

### Name app & choose workspace

Name app, for example "slack-stock".  
If you are the workspace owner, your options will automatically appear.

<center>

![03.Name_app_&_choose_workspace](docs/images/03.Name_app_&_choose_workspace.png)

![04.Name_app_&_choose_workspace_after](docs/images/04.Name_app_&_choose_workspace_after.png)

</center>

### OAuth & Permissions

<center>

![05.OAuth_&_Permissions](docs/images/05.OAuth_&_Permissions.png)

</center>

### User Token Scopes

Add OAuth Scopes, slack-stock needs below scopes.

- channels:read
- channels:history
- users:read

<center>

![06.User_Token_Scopes](docs/images/06.User_Token_Scopes.png)

</center>

### Install to Workspace

Install the app in your workspace when you're ready.  
Only Token is issued, and the actual state of the application has not been completed yet.

<center>

![07.Install_to_Workspace](docs/images/07.Install_to_Workspace.png)

![08.Finish](docs/images/08.Finish.png)

</center>

## Install slack-stock

### Linux Installation

```sh-session
$ npm install -g slack-stock
$ slst COMMAND
running command...
$ slst (-v|--version|version)
slack-stock/0.1.0 linux-x64 node-v14.15.3
$ slst --help [COMMAND]
USAGE
  $ slst COMMAND
...
```

### Windows Installation

- downloads from release page.
<!-- installationstop -->

# Tutorial

<!-- tutorial -->

video

<!-- tutorialtop -->

# Commands

<!-- commands -->

- [`slst config`](#slst-config)
- [`slst contact`](#slst-contact)
- [`slst hello`](#slst-hello)
- [`slst help [COMMAND]`](#slst-help-command)
- [`slst stock [DATA]`](#slst-stock-data)
- [`slst view [DATA] [OUTPUT]`](#slst-view-data-output)

## `slst config`

describe the command here

```
USAGE
  $ slst config

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/config.ts](https://github.com/cli/slack-stock/blob/v0.0.0/src/commands/config.ts)_

## `slst contact`

describe the command here

```
USAGE
  $ slst contact
```

_See code: [src/commands/contact.ts](https://github.com/cli/slack-stock/blob/v0.0.0/src/commands/contact.ts)_

## `slst hello`

describe the command here

```
USAGE
  $ slst hello

OPTIONS
  -h, --help  show CLI help

ALIASES
  $ slst

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

## `slst stock [DATA]`

describe the command here

```
USAGE
  $ slst stock [DATA]

ARGUMENTS
  DATA  (message|user|channel) select fetch data

OPTIONS
  -c, --channel=channel  if fetch message data, set channel name or channel id
  -f, --from=from        if fetch message data, set from date, format=yyyy-MM-dd
  -h, --help             show CLI help
  -n, --name=name        slack name from config file
  -t, --to=to            if fetch message data, set to date, format=yyyy-MM-dd
```

_See code: [src/commands/stock.ts](https://github.com/cli/slack-stock/blob/v0.0.0/src/commands/stock.ts)_

## `slst view [DATA] [OUTPUT]`

describe the command here

```
USAGE
  $ slst view [DATA] [OUTPUT]

ARGUMENTS
  DATA    (message|user|channel) select output data
  OUTPUT  (console|csv|tsv|excel) select output type

OPTIONS
  -c, --channel=channel  if fetch message data, set channel name or channel id
  -f, --from=from        if fetch message data, set from date, format=yyyy-MM-dd
  -h, --help             show CLI help
  -t, --to=to            if fetch message data, set to date, format=yyyy-MM-dd
```

_See code: [src/commands/view.ts](https://github.com/cli/slack-stock/blob/v0.0.0/src/commands/view.ts)_

<!-- commandsstop -->

# Program Resources

## Options
