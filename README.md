# slack-stock

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/slack-stock.svg)](https://npmjs.org/package/slack-stock)
[![Downloads/week](https://img.shields.io/npm/dw/slack-stock.svg)](https://npmjs.org/package/slack-stock)
[![License](https://img.shields.io/npm/l/slack-stock.svg)](https://github.com/oktntko/slack-stock/blob/master/package.json)

<!-- toc -->

- [slack-stock](#slack-stock)
- [About](#about)
- [Introduction](#introduction)
- [Installation](#installation)
- [Commands](#commands)
- [Program Resources](#program-resources)
<!-- tocstop -->

# About

Ever wanted to see your Slack messages in tabular format?  
This app can stock Slack data in your DB (SQLite) with some setup. And you can view the data in various supported formats (Excel, Csv, Tsv, Console).  
And best of all, this app is a command line tool. This means that you can accumulate data on a daily basis by performing scheduled executions (cron for Linux, task manager for Windows). It will make your Slack Life more brilliant.  
Have a great Slack Life with slack-stock!

# Introduction

https://user-images.githubusercontent.com/72344657/141394536-e5fc5a55-2469-49ec-a142-8fa2e0522ec5.mp4

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

- channels:history
- channels:read
- groups:history
- groups:read
- team:read
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
$ slst (-v|--version|version)
# First, add your OAuth token
$ slst teams add --token=xoxp-xxxxxxxxxxxxx-xxxxxxxxxxxxx-xxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
...
```

### Windows Installation

- downloads from release page.
<!-- installationstop -->

# Commands

<!-- commands -->

- [`slst menu`](#slst-menu)
- [`slst teams [ACTION]`](#slst-teams-action)
- [`slst data [ACTION]`](#slst-data-action)
- [`slst messages [ACTION]`](#slst-messages-action)
- [`slst help [COMMAND]`](#slst-help-command)

## `slst menu`

Select menu

```
USAGE
  $ slst menu

OPTIONS
  -h, --help  show CLI help

ALIASES
  $ slst
```

## `slst teams [ACTION]`

You can add & view team

```
USAGE
  $ slst teams [ACTION]

ARGUMENTS
  ACTION  (add|view) OAuth token installed your workspace

OPTIONS
  -h, --help                         show CLI help
  -t, --output=console|csv|tsv|xlsx  Select output format
  -t, --token=token                  OAuth token installed your workspace

ALIASES
  $ slst t
  $ slst team
```

## `slst data [ACTION]`

You can fetch & view data(user & channel)

```
USAGE
  $ slst data [ACTION]

OPTIONS
  -h, --help                         show CLI help
  -o, --output=console|csv|tsv|xlsx  Select output format
  -t, --team=team                    Enter team name

ALIASES
  $ slst d
```

## `slst messages [ACTION]`

You can stock & view message

```
USAGE
  $ slst messages [ACTION]

OPTIONS
  -c, --channel=channel              Enter channel name
  -d, --day                          If this flag ON, period is from one day ago to now.
  -h, --help                         show CLI help
  -k, --keyword=keyword              Enter timer keyword. ex) --keyword="start" "stop"
  -m, --month                        If this flag ON, period is from one month ago to now.
  -o, --output=console|csv|tsv|xlsx  Select output format
  -p, --period=period                Enter period. ex) --period="YYYY-MM-DD" "YYYY-MM-DD"
  -w, --week                         If this flag ON, period is from one week ago to now.

ALIASES
  $ slst m
  $ slst message
```

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

<!-- commandsstop -->

# Program Resources

This app stocks data in a local database.

```
~/.slack-stock.db        - SQLite DB this app use. Do not remove or modify.
~/.slack-stock.password  - OAuth token encrypt/decrypt key. Do not remove or modify.
```

## Uninstall

```
npm uninstall -g slack-stock
rm ~/.slack-stock.db ~/.slack-stock.password
```
