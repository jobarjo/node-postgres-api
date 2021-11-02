const express = require('express');

const get = require('./get');
const post = require('./post');

const verifyPermission = require('../../../middlewares/permission/verifyPermission');
const validateInput = require('../../../middlewares/express/request/inputValidation/verifyInput');

const router = express.Router();

module.exports = (dbMain) => {
  router.get('/',
    verifyPermission('timestamps_timestamps', 'getTimestamps'),
    get(dbMain));

  router.post('/',
    post.processInput,
    validateInput,
    verifyPermission('timestamps_timestamps', 'createTimestamp'),
    post.writeToDb(dbMain));

  return router;
};
