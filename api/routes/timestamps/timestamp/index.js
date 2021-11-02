const express = require('express');

const get = require('./get');
const patch = require('./patch');
const del = require('./delete');

const verifyPermission = require('../../../middlewares/permission/verifyPermission');
const validateInput = require('../../../middlewares/express/request/inputValidation/verifyInput');

const router = express.Router();

module.exports = () => {
  router.get('/',
    verifyPermission('timestamps_timestamp', 'getTimestamp'),
    get);

  router.patch('/',
    patch.processInput,
    validateInput,
    verifyPermission('timestamps_timestamp', 'patchTimestamp'),
    patch.updateDb);

  router.delete('/',
    verifyPermission('timestamps_timestamp', 'deleteTimestamp'),
    del);

  return router;
};
