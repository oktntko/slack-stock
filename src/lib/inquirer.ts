import inquirer from 'inquirer';
import date from 'inquirer-date-prompt';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
inquirer.registerPrompt('date', date);
