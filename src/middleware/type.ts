import { Option } from '@commander-js/extra-typings';

export const OUPUT_FORMAT_LIST = ['console', 'csv', 'tsv', 'xlsx'] as const;
export type OuputFormatType = (typeof OUPUT_FORMAT_LIST)[number];
export const OUTPUT_OPTION = new Option('-o, --output', 'Select output format').choices(
  OUPUT_FORMAT_LIST,
);
