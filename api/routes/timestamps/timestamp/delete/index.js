const restifyErrors = require('restify-errors');

module.exports = async (req, res, next) => {
  const { logger, targetTimestamp } = req.locals;

  try {
    await targetTimestamp.destroy();
  } catch (err) {
    logger.error(`[users-users-del] Sequelize Error: ${err.message}`);
    return next(new restifyErrors.InternalServerError());
  }

  return res.json('Timestamp deleted.');
};
