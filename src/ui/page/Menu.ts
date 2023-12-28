import inquirer from 'inquirer';
import { color } from '~/lib/color';
import { Icon } from '~/ui/element/Icon';

export const Menu = {
  open,
};

export async function open() {
  for (;;) {
    const action = await selectAction();
    switch (action) {
      case 'teams-add':
        // await COMMANDS.teams.add(options);
        break;
      case 'teams-view':
        // await COMMANDS.teams.view(options);
        break;
      case 'data-fetch':
        // await COMMANDS.data.fetch(options);
        break;
      case 'data-view':
        // await COMMANDS.data.view(options);
        break;
      case 'messages-stock':
        // await COMMANDS.messages.stock(options);
        break;
      case 'messages-view':
        // await COMMANDS.messages.view(options);
        break;
      case 'messages-search':
        // await COMMANDS.messages.search();
        break;
      case 'messages-timer':
        // await COMMANDS.messages.timer(options);
        break;
    }

    if (!(await selectContinue())) {
      console.log(color.info('👋 Bye!'));
      break;
    }
  }
}

async function selectAction() {
  const ACTION_LIST = [
    // new inquirer.Separator('== 💬 Messages ========================='),
    {
      name: '📥 Message stock',
      value: 'messages-stock',
    },
    {
      name: '📁 Message view',
      value: 'messages-view',
    },
    {
      name: '🔍 Message search',
      value: 'messages-search',
    },
    {
      name: '⏰ Message timer',
      value: 'messages-timer',
    },
    // new inquirer.Separator('== 💽 Data (👤 Users & 📺 Channels) ===='),
    {
      name: '🔄 Data fetch',
      value: 'data-fetch',
    },
    {
      name: '📁 Data view',
      value: 'data-view',
    },
    // new inquirer.Separator('== 👪 Teams ============================'),
    {
      name: '➕ Team add',
      value: 'teams-add',
    },
    {
      name: '📁 Team view',
      value: 'teams-view',
    },
  ] as const;

  // TODO inquirer.Separator type
  const { selection } = await inquirer.prompt<{
    selection: (typeof ACTION_LIST)[number]['value'];
  }>([
    {
      type: 'list',
      name: 'selection',
      prefix: Icon.question,
      message: 'What do you want to do?',
      choices: ACTION_LIST,
      pageSize: ACTION_LIST.length,
    },
  ]);

  return selection;
}

export const selectContinue = async (): Promise<boolean> => {
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      prefix: Icon.question,
      message: 'continue?',
      default: true,
    },
  ]);

  return confirm;
};
