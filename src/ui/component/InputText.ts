import inquirer from 'inquirer';
import { Icon } from '~/ui/element/Icon';

export async function InputText(message: string) {
  const { input } = await inquirer.prompt<{ input: string }>([
    {
      type: 'input',
      name: 'input',
      prefix: Icon.question,
      message,
    },
  ]);

  return input;
}
