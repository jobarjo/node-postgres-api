/* eslint-disable no-console */

const { program } = require('commander');

program
  .option('-u, --db_user <value>', 'db username', 'db_user')
  .option('-p, --db_pass <value>', 'db password', 'db_password')
  .option('-n, --db_name <value>', 'db name', 'db_name')
  .option('-d, --db_dialect <value>', 'db dialect', 'postgres')
  .option('-h, --db_host <value>', 'db host', 'localhost')
  .option('-l, --db_logging <value>', 'db logging', true)
  .parse(process.argv);

const dbConfig = {
  username: program.db_user,
  password: program.db_pass,
  database: program.db_name,
  dialect: program.db_dialect,
  host: program.db_host,
  logging: program.db_logging,
};

const db = require('../index')(dbConfig);

(async () => {
  try {
    console.log('Resetting database...');
    await db.sequelize.drop();
  } catch (e) {
    console.log('Error resetting database.', e);
  }

  console.log('Reset completed successfully.');

  await db.sequelize.close();
})();
