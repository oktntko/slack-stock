import inquirer from 'inquirer';
import { Icon } from '~/ui/element/Icon';

export async function SelectAction() {
  const ACTION_LIST = [
    new inquirer.Separator('== 💬 Messages ========================='),
    {
      name: '🔄 Message fetch',
      value: 'message-fetch',
    },
    {
      name: '📃 Message view',
      value: 'message-view',
    },
    {
      name: '🔍 Message search',
      value: 'message-search',
    },
    {
      name: '⏰ Message stopwatch',
      value: 'message-stopwatch',
    },
    new inquirer.Separator('== 💽 Data (👤 Users & 📺 Channels & 💬 Messages) ===='),
    {
      name: '🔄 Data fetch',
      value: 'data-fetch',
    },
    new inquirer.Separator('== 👪 Teams ============================'),
    {
      name: '➕ Team add',
      value: 'team-add',
    },
    {
      name: '📃 Team view',
      value: 'team-view',
    },
    new inquirer.Separator('== 👤 Users ============================'),
    {
      name: '🔄 User fetch',
      value: 'user-fetch',
    },
    {
      name: '📃 User view',
      value: 'user-view',
    },
    new inquirer.Separator('== 📺 Channels ============================'),
    {
      name: '🔄 Channels fetch',
      value: 'channel-fetch',
    },
    {
      name: '📃 Channels view',
      value: 'channel-view',
    },
  ] as const;

  const { list } = await inquirer.prompt<{
    list:
      | 'message-fetch'
      | 'message-view'
      | 'message-search'
      | 'message-stopwatch'
      | 'data-fetch'
      | 'team-add'
      | 'team-view'
      | 'user-fetch'
      | 'user-view'
      | 'channel-fetch'
      | 'channel-view';
  }>([
    {
      type: 'list',
      name: 'list',
      prefix: Icon.question,
      message: 'What do you want to do?',
      choices: ACTION_LIST,
      pageSize: ACTION_LIST.length,
    },
  ]);

  return list;
}
