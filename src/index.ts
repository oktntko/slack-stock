import { program } from './app';
import './middleware/password';
import { createTableIfNotExists } from './middleware/prisma';

createTableIfNotExists()
  .then(() => {
    program.parse(process.argv);
  })
  .catch((err) => {
    console.error('err');
  });
// program.parse(process.argv);
