const restifyErrors = require('restify-errors');

// eslint-disable-next-line no-unused-vars
module.exports = (error, req, res, next) => {
  const { logger } = req.locals;

  const err = buildErrorObject(logger, error);

  res
    .status(err.statusCode)
    .json({
      error: {
        code: err.code,
        message: error.message || error.toString(),
      },
    });
};

function buildErrorObject(logger, error) {
  if (!error.statusCode) {
    logger.error(`[MW-errorHandler] ${error.message || error.toString()}`);

    return new restifyErrors.InternalServerError('Internal Server Error');
  }

  return error;
}
