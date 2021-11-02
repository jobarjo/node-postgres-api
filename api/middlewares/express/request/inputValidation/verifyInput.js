const R = require('ramda');
const validationUtils = require('./utils');

module.exports = (req, res, next) => {
  const {
    logger,
    validationData: { inputToValidate, inputValidators },
  } = req.locals;

  R.pipe(
    validationUtils.checkInputType(logger),
    validationUtils.checkInputNotNil(logger),
    validationUtils.checkEachInputIsExpected(logger, inputValidators),
    validationUtils.checkRequiredInputIsPresent(logger, inputValidators),
    validationUtils.validateEachInput(logger, inputValidators),
  )(inputToValidate);

  return next();
};
