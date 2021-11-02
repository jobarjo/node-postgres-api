const R = require('ramda');
const restifyErrors = require('restify-errors');

module.exports = (dbMain) => async (req, res, next) => {
  const { logger, targetUserId } = req.locals;

  let targetUser;

  try {
    targetUser = await dbMain.User.findOne({
      where: {
        id: targetUserId,
      },
      attributes: { exclude: ['passwordHash'] },
    });
  } catch (err) {
    logger.error(`[MW-dbFetch-user-fetchTargetUser] Sequelize Error: ${err.message}`);
    return next(new restifyErrors.InternalServerError());
  }

  if (R.isNil(targetUser)) {
    const errMessage = `Requested user: ${targetUserId} could not be found.`;
    logger.error(`[MW-dbFetch-user-fetchTargetUser] ${errMessage}`);
    return next(new restifyErrors.NotFoundError(errMessage));
  }

  req.locals.targetUser = targetUser;

  return next();
};
