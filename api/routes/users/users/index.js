const express = require('express');

const get = require('./get');

const verifyPermission = require('../../../middlewares/permission/verifyPermission');

const router = express.Router();

module.exports = (dbMain) => {
  router.get('/',
    verifyPermission('users_users', 'getUsers'),
    get(dbMain));

  return router;
};
