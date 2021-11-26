const R = require('ramda');
const bcrypt = require('bcrypt');
const restifyErrors = require('restify-errors');
const processInput = require('./processInput');

module.exports = {
  processInput,

  updateDb: (appConfig) => async (req, res, next) => {
    const { logger, targetUser } = req.locals;

    let passwordHash;

    if (R.isEmpty(req.body)) {
      return next();
    }

    if (req.body?.password) {
      const { saltRounds } = appConfig.get('jwt');

      try {
        passwordHash = await bcrypt.hash(req.body.password, saltRounds);
      } catch (err) {
        logger.error(`[auth-signup-writeToDb] bcrypt Error: ${err}`);
        return next(new restifyErrors.InternalServerError());
      }
    }

    try {
      await targetUser.update({
        ...req.body,
        ...(passwordHash && { passwordHash }),
      });
    } catch (err) {
      logger.error(`[users-user-patch-updateDb] Sequelize Error: ${err}`);
      return next(new restifyErrors.InternalServerError());
    }

    return res.json('User updated.');
  },
};
