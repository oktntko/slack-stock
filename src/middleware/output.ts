import dayjs, { type Dayjs } from 'dayjs';
import os from 'os';
import path from 'path';
import xlsx from 'xlsx';

export async function output(
  outputFormat: 'console' | 'csv' | 'xlsx',
  records: object[],
  filePath: string,
) {
  switch (outputFormat) {
    case 'console': {
      console.table(records);
      return filePath;
    }
    default: {
      writeFile(outputFormat, records, filePath);
      return filePath;
    }
  }
}

function writeFile(bookType: 'csv' | 'xlsx', records: object[], filePath: string) {
  const flattenRecords = records.map((x) => flatten(x));
  const data = [Object.keys(flattenRecords[0]), ...flattenRecords.map((x) => Object.values(x))];
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

// https://stackoverflow.com/questions/33036487/one-liner-to-flatten-nested-object
// $roots keeps previous parent properties as they will be added as a prefix for each prop.
// $sep is just a preference if you want to seperate nested paths other than dot.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function flatten<T extends object>(obj: T, roots = [], sep = '.') {
  return (
    Object
      // find props of given object
      .keys(obj)
      // return an object by iterating props
      .reduce(
        (memo, prop) => {
          return Object.assign(
            // create a new object
            {},
            // include previously returned object
            memo,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            Object.prototype.toString.call(obj[prop]) === '[object Object]'
              ? // keep working if value is an object
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                flatten(obj[prop], roots.concat([prop]), sep)
              : // include current prop and value and prefix prop with the roots
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                { [roots.concat([prop]).join(sep)]: obj[prop] },
          );
        },
        {} as Record<string, string>,
      )
  );
}
