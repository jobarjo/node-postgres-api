const restifyErrors = require('restify-errors');
const { User } = require('../../../../resources/entities');

module.exports = (dbMain) => async (req, res, next) => {
  const { logger } = req.locals;

  let timestamps;

  try {
    timestamps = await dbMain.Timestamp.findAll({
      include: [{
        model: dbMain.User,
        attributes: User.publicFields,
      }],
    });
  } catch (err) {
    logger.error(`[timestamps-timestamps-getTimestamps] Sequelize Error: ${err.message}`);
    return next(new restifyErrors.InternalServerError());
  }

  return res.json(timestamps);
};
