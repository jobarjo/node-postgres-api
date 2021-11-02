const restifyErrors = require('restify-errors');
const R = require('ramda');

/**
 * This MW has the role to fetch the request user from our DB
 * for it to be used in the rest of the API.
 */
module.exports = (dbMain) => async (req, res, next) => {
  const { logger, userId } = req.locals;

  let requestUser;

  try {
    requestUser = await dbMain.User.findOne({
      where: {
        id: userId,
      },
      attributes: { exclude: ['passwordHash'] },
    });
  } catch (err) {
    logger.error(`[MW-dbFetch-user-fetchRequestUser] Sequelize Error: ${err.message}`);
    return next(new restifyErrors.InternalServerError());
  }

  if (R.isNil(requestUser)) {
    const errMessage = `Requested user: ${userId} could not be found. Singup again.`;
    logger.error(`[MW-dbFetch-user-fetchRequestUser] ${errMessage}`);
    return next(new restifyErrors.NotFoundError(errMessage));
  }

  logger.debug(`[MW-dbFetch-user-fetchRequestUser] userId: ${requestUser.id}`);

  req.locals.requestUser = requestUser;

  return next();
};
