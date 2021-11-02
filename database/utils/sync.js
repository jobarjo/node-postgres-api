/* eslint-disable no-console */

const { program } = require('commander');

program
  .storeOptionsAsProperties()
  .option('-f, --force', 'force database sync')
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

// cast to be true/false
program.force = !!program.force;

const options = {
  force: program.force,
};

(async () => {
  try {
    console.log('Synchronising database %s', program.force ? 'with force' : '');

    await db.sequelize.sync(options);
  } catch (e) {
    console.log('Error syncing database.', e);
  }

  console.log('Sync completed successfully.');

  await db.sequelize.close();
})();
