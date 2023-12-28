import { program } from '~/app';
import '~/lib/dayjs';
import '~/lib/inquirer';
import '~/middleware/password';
import { createTableIfNotExists } from '~/middleware/prisma';

createTableIfNotExists()
  .then(() => program.parseAsync(process.argv))
  .catch(console.error);
