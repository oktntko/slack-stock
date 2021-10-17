import inquirer from "inquirer";

inquirer.registerPrompt(
  "autocomplete",
  require("inquirer-autocomplete-prompt")
);
//intl-date-time-format-checker.pages.dev/
https: inquirer.registerPrompt("date", require("inquirer-date-prompt"));

export default inquirer;
