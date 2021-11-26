const R = require('ramda');
const restifyErrors = require('restify-errors');
const processInput = require('./processInput');

module.exports = {
  processInput,

  updateDb: async (req, res, next) => {
    const { logger, targetTimestamp } = req.locals;

    if (R.isEmpty(req.body)) {
      return next();
    }

    try {
      await targetTimestamp.update({ ...req.body });
    } catch (err) {
      logger.error(`[timestamps-timestamp-patch-updateDb] Sequelize Error: ${err}`);
      return next(new restifyErrors.InternalServerError());
    }

    return res.json('Timestamp updated.');
  },
};
