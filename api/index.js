const express = require('express');
const bodyParser = require('body-parser');
const appConfig = require('../config/config');
const LoggerFactory = require('./utils/logger');
const Db = require('../database/index');

const routes = require('./routes');

const errorHandler = require('./middlewares/express/errors/errorHandler');
const notFoundHandler = require('./middlewares/express/errors/notFoundHandler');
const requestLogger = require('./middlewares/express/request/logger/requestLogger');

const logger = LoggerFactory.create({
  enabled: appConfig.get('logging').enabled,
  defaultMeta: { service: appConfig.get('server').name },
});

const app = (config) => {
  const serverConfig = config.get('server');

  const dbMain = Db(config.get('db_main'), logger);

  const server = express();

  server.set('port', serverConfig.port);

  server.use(bodyParser.json());

  // defines req.locals.logger
  server.use('*', requestLogger(config));
  // API Routes
  server.all('*', routes(config, dbMain));
  // Error handler
  server.use(notFoundHandler);
  server.use(errorHandler);

  return server;
};

let server;

if (require.main === module) {
  server = app(appConfig);

  server.listen(appConfig.get('server').port, () => {
    logger.info('Server is on!');
  });
}

module.exports = server || app;
