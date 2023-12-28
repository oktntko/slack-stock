import dayjs, { type Dayjs } from 'dayjs';
import inquirer from 'inquirer';
import { Icon } from '~/ui/element/Icon';

export async function InputDate(message: string, initialiValue: Dayjs) {
  const { selection } = await inquirer.prompt<{ selection: Dayjs }>([
    {
      type: 'date',
      name: 'selection',
      prefix: Icon.question,
      message: message,
      default: initialiValue.toDate(),
      filter: (d: Date) => dayjs(d),
      format: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        weekday: 'narrow',
        timeZoneName: 'short',
        hour: undefined,
        minute: undefined,
      },
    },
  ]);

  return selection;
}
