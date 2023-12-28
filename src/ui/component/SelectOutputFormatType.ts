import inquirer from 'inquirer';
import { OutputFormatType } from '~/middleware/type';
import { Icon } from '~/ui/element/Icon';

export async function SelectOutputFormatType() {
  const { selection } = await inquirer.prompt<{ selection: OutputFormatType }>([
    {
      type: 'list',
      name: 'selection',
      prefix: Icon.question,
      message: 'What output type do you want to do?',
      choices: [
        {
          name: '📗 Excel',
          value: 'xlsx',
        },
        {
          name: '🔲 Console',
          value: 'console',
        },
        {
          name: '📑 Csv',
          value: 'csv',
        },
      ],
    },
  ]);

  return selection;
}
