const restifyErrors = require('restify-errors');
const processInput = require('./processInput');

module.exports = {
  processInput,

  writeToDb: (dbMain) => async (req, res, next) => {
    const { logger } = req.locals;

    let timestamp;

    try {
      timestamp = await dbMain.Timestamp.create({
        ...req.body,
      });
    } catch (err) {
      logger.error(`[users-timestamps-create-writeToDb] Sequelize Error: ${err.message}`);
      return next(new restifyErrors.InternalServerError());
    }

    return res.json(timestamp);
  },
};
