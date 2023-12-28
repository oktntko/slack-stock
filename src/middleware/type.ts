import { Option } from '@commander-js/extra-typings';

export const OUPUT_FORMAT_LIST = ['console', 'csv', 'xlsx'] as const;
export type OutputFormatType = (typeof OUPUT_FORMAT_LIST)[number];
export const OUTPUT_OPTION = new Option(
  '-o, --output <output format>',
  'Select output format',
).choices(OUPUT_FORMAT_LIST);
