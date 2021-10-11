import inquirer from "inquirer";
import autocomplete from "inquirer-autocomplete-prompt";

inquirer.registerPrompt("autocomplete", autocomplete);

export default inquirer;
