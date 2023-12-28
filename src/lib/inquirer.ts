import inquirer from 'inquirer';
import autocomplete from 'inquirer-autocomplete-prompt';
import date from 'inquirer-date-prompt';

inquirer.registerPrompt('autocomplete', autocomplete);
// TODO タイプエラー
inquirer.registerPrompt('date', date);
