import dayjs, { type Dayjs } from 'dayjs';
import os from 'os';
import path from 'path';
import xlsx from 'xlsx';
import { OutputFormatType } from '~/middleware/type';

export async function output(format: OutputFormatType, values: object[], filePath: string) {
  switch (format) {
    case 'console': {
      console.table(values);
      return;
    }
    default: {
      writeFile(format, values, filePath!);
      return;
    }
  }
}

function writeFile(bookType: 'csv' | 'xlsx', values: object[], filePath: string) {
  const data = [Object.keys(values[0]), ...values.map((v) => Object.values(v))];
  const workbook = xlsx.utils.book_new();
  const worksheet = xlsx.utils.aoa_to_sheet(data);

  xlsx.utils.book_append_sheet(workbook, worksheet, 'sheet1');
  xlsx.writeFile(workbook, filePath, {
    bookType,
    type: 'buffer',
  });
}

function basepath(fileName: string) {
  return path.join(os.homedir(), fileName);
}
export function filepath(dataType: 'team' | 'channel' | 'user', format: OutputFormatType): string;
export function filepath(
  dataType: 'message',
  format: OutputFormatType,
  from: Dayjs,
  to: Dayjs,
): string;
export function filepath(
  dataType: 'team' | 'channel' | 'user' | 'message',
  format: OutputFormatType,
  from?: Dayjs,
  to?: Dayjs,
) {
  switch (dataType) {
    case 'message': {
      return basepath(
        `@slst_${dataType}_${from!.format('YYYY-MM-DD')}〜${to!.format('YYYY-MM-DD')}.${format}`,
      );
    }
    default: {
      return basepath(`@slst_${dataType}_${dayjs().format('YYYY-MM-DD')}.${format}`);
    }
  }
}
1;
