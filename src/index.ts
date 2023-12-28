import { program } from '~/app';
import '~/lib/inquirer';
import '~/middleware/password';
import { createTableIfNotExists } from '~/middleware/prisma';

createTableIfNotExists()
  .then(() => {
    program.parse(process.argv);
  })
  .catch((err) => {
    console.error(err);
  });
