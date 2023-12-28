import inquirer from 'inquirer';
import { Icon } from '~/ui/element/Icon';

export async function Confirm(message: string) {
  const { confirm } = await inquirer.prompt<{ confirm: boolean }>([
    {
      type: 'confirm',
      name: 'confirm',
      prefix: Icon.question,
      message,
      default: true,
    },
  ]);

  return confirm;
}
