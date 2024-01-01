#!/usr/bin/env node
import '~/lib/dayjs';
import '~/lib/inquirer';
import '~/middleware/password';
import { createTableIfNotExists } from '~/middleware/prisma';

import { program } from '~/app';

createTableIfNotExists()
  .then(() => program.parseAsync(process.argv))
  .catch(console.error);
