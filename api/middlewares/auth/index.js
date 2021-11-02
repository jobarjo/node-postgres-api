const R = require('ramda');
const restifyErrors = require('restify-errors');
const util = require('util');
const jwt = require('jsonwebtoken');

const jwtVerify = util.promisify(jwt.verify);

module.exports = (appConfig) => async (req, res, next) => {
  const { logger } = req.locals;

  const token = req.get('x-access-token');

  if (R.isNil(token)) {
    const errMessage = 'No token provided.';
    logger.error(`[MW-auth] ${errMessage}`);
    return next(new restifyErrors.UnauthorizedError(errMessage));
  }

  const { secret } = appConfig.get('jwt');

  let decoded;

  try {
    decoded = await jwtVerify(token, secret);
  } catch (err) {
    const errMessage = 'Unauthorized.';
    logger.error(`[MW-auth] ${errMessage}`);
    return next(new restifyErrors.UnauthorizedError(errMessage));
  }

  req.locals.userId = decoded.id;

  return next();
};
