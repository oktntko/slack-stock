import autocomplete from 'inquirer-autocomplete-standalone';

export async function Autocomplete(...args: Parameters<typeof autocomplete>) {
  return autocomplete(...args);
}
