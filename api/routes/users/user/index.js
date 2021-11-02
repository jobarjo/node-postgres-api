const express = require('express');

const get = require('./get');
const patch = require('./patch');
const del = require('./delete');

const verifyPermission = require('../../../middlewares/permission/verifyPermission');
const validateInput = require('../../../middlewares/express/request/inputValidation/verifyInput');

const router = express.Router();

module.exports = (appConfig) => {
  router.get('/',
    verifyPermission('users_user', 'getUser'),
    get);

  router.patch('/',
    patch.processInput,
    validateInput,
    verifyPermission('users_user', 'patchUser'),
    patch.updateDb(appConfig));

  router.delete('/',
    verifyPermission('users_user', 'deleteUser'),
    del);

  return router;
};
