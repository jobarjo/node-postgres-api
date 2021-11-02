const express = require('express');

const fetchRequestUser = require('../middlewares/dbFetch/user/fetchRequestUser');
const authentication = require('../middlewares/auth');

const healthcheck = require('./healthcheck');
const auth = require('./auth');
const users = require('./users');
const timestamps = require('./timestamps');

const router = express.Router();

module.exports = (appConfig, dbMain) => {
  router.get('/', healthcheck(appConfig.get('server')));

  router.use('/auth',
    auth(appConfig, dbMain));

  router.use('/users',
    authentication(appConfig),
    fetchRequestUser(dbMain),
    users(appConfig, dbMain));

  router.use('/timestamps',
    authentication(appConfig),
    fetchRequestUser(dbMain),
    timestamps(dbMain));

  return router;
};
