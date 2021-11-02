/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

const R = require('ramda');
const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const { setupAssociations } = require('./associations');

module.exports = (config, logger) => {
  // Define logger for the sequelize instance
  const sequelize = new Sequelize(defineConfigLogger(config, logger));

  const db = {};

  // Define the Sequelize models.
  // This will populate the sequelize object. It is stored at root level
  // of the `db` object for easy access.
  fs.readdirSync(`${__dirname}/models`)
    .filter((file) => (file.indexOf('.') !== 0))
    .forEach((file) => {
      const filePath = path.join(__dirname, 'models/', file);
      const model = require(filePath)(sequelize, DataTypes);
      const modelName = capitalizeFirstLetterOfString(model.name);
      db[modelName] = model;
    });

  // Adding the models' associations
  setupAssociations(db);

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  return db;
};

function defineConfigLogger(config, logger) {
  const sequelizeConfig = { ...config };

  // default to no logging - it's a very noisy module.
  if (R.isNil(sequelizeConfig.logging) || !sequelizeConfig.logging) {
    sequelizeConfig.logging = false;
  } else {
    // eslint-disable-next-line no-console
    sequelizeConfig.logging = logger ? queryLogger(logger) : console.log;
  }

  return sequelizeConfig;
}

function queryLogger(logger) {
  return (log) => {
    const query = R.pipe(
      R.match(/(?:Executing|Executed \(.*\): )([^]+;?)/),
      R.nth(1),
      R.replace(/\sElapsed time: \d+ms$/, ''),
      R.replace(/\n/g, '\\n'),
    )(log);

    const duration = R.pipe(
      R.match(/\sElapsed time: (\d+)ms$/),
      R.nth(1),
    )(log);

    const logObject = { query };

    if (!Number.isNaN(duration)) {
      logObject.duration = Number(duration);
    }

    logger.debug('queried database', logObject);
  };
}

function capitalizeFirstLetterOfString(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
