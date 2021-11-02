const express = require('express');

const timestamps = require('./timestamps');
const timestamp = require('./timestamp');

const processInput = require('./processInput');

const fetchRequestTimestamp = require('../../middlewares/dbFetch/timestamp/fetchRequestTimestamp');
const validateInput = require('../../middlewares/express/request/inputValidation/verifyInput');

const router = express.Router();

module.exports = (dbMain) => {
  router.use('/', timestamps(dbMain));

  router.use('/:targetTimestampId',
    processInput,
    validateInput,
    fetchRequestTimestamp(dbMain),
    timestamp());

  return router;
};
