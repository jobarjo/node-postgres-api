const restifyErrors = require('restify-errors');

module.exports = async (req, res, next) => {
  const { logger, targetUser } = req.locals;

  try {
    await targetUser.destroy();
  } catch (err) {
    logger.error(`[users-users-del] Sequelize Error: ${err.message}`);
    return next(new restifyErrors.InternalServerError());
  }

  return res.json('User deleted.');
};
