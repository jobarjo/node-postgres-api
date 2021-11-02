const restifyErrors = require('restify-errors');
const R = require('ramda');

/**
 * This MW has the role to fetch the timestamp from our DB for it
 * to be used in the rest of the API.
 */
module.exports = (dbMain) => async (req, res, next) => {
  const { logger, targetTimestampId } = req.locals;

  let targetTimestamp;

  try {
    targetTimestamp = await dbMain.Timestamp.findOne({
      where: {
        id: targetTimestampId,
      },
      include: [{
        model: dbMain.User,
        attributes: { exclude: ['passwordHash'] },
      }],
    });
  } catch (err) {
    logger.error(`[MW-dbFetch-timestamp-fetchRequestTimestamp] Sequelize Error: ${err.message}`);
    return next(new restifyErrors.InternalServerError());
  }

  if (R.isNil(targetTimestamp)) {
    const errMessage = `Requested timestamp: ${targetTimestampId} could not be found.`;
    logger.error(`[MW-dbFetch-timestamp-fetchRequestTimestamp] ${errMessage}`);
    return next(new restifyErrors.NotFoundError(errMessage));
  }

  logger.debug(`[MW-dbFetch-timestamp-fetchRequestTimestamp] timestampId: ${targetTimestamp.id}`);

  req.locals.targetTimestamp = targetTimestamp;

  return next();
};
