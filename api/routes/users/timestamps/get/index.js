const restifyErrors = require('restify-errors');

module.exports = () => async (req, res, next) => {
  const { logger, targetUser } = req.locals;

  let timestamps;

  try {
    timestamps = await targetUser.getTimestamps();
  } catch (err) {
    logger.error(`[timestamps-timestamps-getTimestamps] Sequelize Error: ${err.message}`);
    return next(new restifyErrors.InternalServerError());
  }

  return res.json(timestamps);
};
