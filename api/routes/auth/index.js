const express = require('express');

const signup = require('./signup');
const signin = require('./signin');

const validateInput = require('../../middlewares/express/request/inputValidation/verifyInput');
const verifyPermission = require('../../middlewares/permission/verifyPermission');

const router = express.Router();

module.exports = (appConfig, dbMain) => {
  router.post('/signup',
    signup.processInput,
    validateInput,
    verifyPermission('auth', 'signup'),
    signup.verifyRequest(dbMain),
    signup.writeToDb(appConfig, dbMain));

  router.post('/signin',
    signin.processInput,
    validateInput,
    verifyPermission('auth', 'signin'),
    signin.verifyRequest(dbMain),
    signin.getJwt(appConfig));

  return router;
};
