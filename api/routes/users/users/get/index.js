const restifyErrors = require('restify-errors');
const { User } = require('../../../../resources/entities');

module.exports = (dbMain) => async (req, res, next) => {
  const { logger } = req.locals;

  let users;

  try {
    users = await dbMain.User.findAll({
      attributes: User.publicFields,
    });
  } catch (err) {
    logger.error(`[users-users-getUsers] Sequelize Error: ${err.message}`);
    return next(new restifyErrors.InternalServerError());
  }

  res.json(users);

  return next();
};
