const restifyErrors = require('restify-errors');
const bcrypt = require('bcrypt');
const R = require('ramda');

module.exports = (dbMain) => async (req, res, next) => {
  const { logger } = req.locals;

  let user;
  let passwordIsValid;

  try {
    user = await dbMain.User.findOne({
      where: {
        id: req.body.id,
      },
    });
  } catch (err) {
    logger.error(`[auth-signin-verifyRequest] Sequelize Error: ${err}`);
    return next(new restifyErrors.InternalServerError());
  }

  if (R.isNil(user)) {
    return next(new restifyErrors.NotFoundError('User Not found'));
  }

  try {
    passwordIsValid = await bcrypt.compare(
      req.body.password,
      user.passwordHash,
    );
  } catch (err) {
    logger.error(`[auth-signin-verifyRequest] bcrypt Error: ${err}`);
    return next(new restifyErrors.InternalServerError());
  }

  if (!passwordIsValid) {
    return next(new restifyErrors.UnauthorizedError('Invalid Password!'));
  }

  req.locals.user = user;

  return next();
};
