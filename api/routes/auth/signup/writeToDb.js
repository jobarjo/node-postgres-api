const bcrypt = require('bcrypt');
const restifyErrors = require('restify-errors');
const { USERS } = require('../../../resources/variables/variables.json');

module.exports = (appConfig, dbMain) => async (req, res, next) => {
  const { logger } = req.locals;

  let passwordHash;
  const { saltRounds } = appConfig.get('jwt');

  try {
    passwordHash = await bcrypt.hash(req.body.password, saltRounds);
  } catch (err) {
    logger.error(`[auth-signup-writeToDb] bcrypt Error: ${err}`);
    return next(new restifyErrors.InternalServerError());
  }

  try {
    await dbMain.User.create({
      id: req.body.id,
      passwordHash,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      role: USERS.ROLES.BACIC,
    });

    res.json('User successfully registered!');

    return next();
  } catch (err) {
    logger.error(`[auth-signup-writeToDb] Sequelize Error: ${err}`);
    return next(new restifyErrors.InternalServerError());
  }
};
