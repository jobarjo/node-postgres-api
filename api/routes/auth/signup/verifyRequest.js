const restifyErrors = require('restify-errors');

module.exports = (dbMain) => async (req, res, next) => {
  const { logger } = req.locals;

  try {
    const user = await dbMain.User.findOne({
      where: {
        id: req.body.id,
      },
    });

    if (user) {
      const errMessage = 'Email is already taken.';
      logger.error(`[auth-signup-verifyRequest] ${errMessage}`);
      return next(new restifyErrors.BadRequestError(errMessage));
    }

    return next();
  } catch (err) {
    logger.error(`[auth-signup-verifyRequest] Sequelize Error: ${err}`);
    return next(new restifyErrors.InternalServerError());
  }
};
