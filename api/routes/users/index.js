const express = require('express');

const users = require('./users');
const user = require('./user');
const timestamps = require('./timestamps');

const processInput = require('./processInput');

const fetchTargetUser = require('../../middlewares/dbFetch/user/fetchTargetUser');
const validateInput = require('../../middlewares/express/request/inputValidation/verifyInput');

const router = express.Router();

module.exports = (appConfig, dbMain) => {
  router.use('/', users(dbMain));

  router.use('/:targetUserId',
    processInput,
    validateInput,
    fetchTargetUser(dbMain),
    user(appConfig));

  router.use('/:targetUserId/timestamps',
    processInput,
    validateInput,
    fetchTargetUser(dbMain),
    timestamps(dbMain));

  return router;
};
