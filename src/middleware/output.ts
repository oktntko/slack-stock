import dayjs, { type Dayjs } from 'dayjs';
import os from 'os';
import path from 'path';
import xlsx from 'xlsx';

export async function output(
  outputFormat: 'console' | 'csv' | 'xlsx',
  values: object[],
  filePath: string,
) {
  switch (outputFormat) {
    case 'console': {
      console.table(values);
      return;
    }
    default: {
      writeFile(outputFormat, values, filePath!);
      return;
    }
  }
}

function writeFile(bookType: 'csv' | 'xlsx', values: object[], filePath: string) {
  // TODO: nested property
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
export function filepath(
  dataType: 'team' | 'channel' | 'user',
  outputFormat: 'console' | 'csv' | 'xlsx',
): string;
export function filepath(
  dataType: 'message',
  outputFormat: 'console' | 'csv' | 'xlsx',
  from: Dayjs,
  to: Dayjs,
): string;
export function filepath(
  dataType: 'team' | 'channel' | 'user' | 'message',
  outputFormat: 'console' | 'csv' | 'xlsx',
  from?: Dayjs,
  to?: Dayjs,
) {
  switch (dataType) {
    case 'message': {
      return basepath(
        `@slst_${dataType}_${from!.format('YYYY-MM-DD')}〜${to!.format(
          'YYYY-MM-DD',
        )}.${outputFormat}`,
      );
    }
    default: {
      return basepath(`@slst_${dataType}_${dayjs().format('YYYY-MM-DD')}.${outputFormat}`);
    }
  }
}
