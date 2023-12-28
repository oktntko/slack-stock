import inquirer from 'inquirer';
import { Icon } from '~/ui/element/Icon';

export async function InputText(message: string) {
  const { keyword } = await inquirer.prompt<{ keyword: string }>([
    {
      type: 'input',
      name: 'keyword',
      prefix: Icon.question,
      message,
    },
  ]);

  return keyword;
}
