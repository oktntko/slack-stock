import inquirer from 'inquirer';
import { OutputFormatType } from '~/middleware/type';
import { Icon } from '~/ui/element/Icon';

export async function SelectOutputFormatType() {
  const { list } = await inquirer.prompt<{ list: OutputFormatType }>([
    {
      type: 'list',
      name: 'list',
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

  return list;
}
