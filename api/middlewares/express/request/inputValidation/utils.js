const restifyErrors = require('restify-errors');
const R = require('ramda');

module.exports = {
  checkInputType: (logger) => (input) => {
    if (R.type(input) !== 'Object') {
      logger.error('Error: unexpected input type.');
      throw new restifyErrors.BadRequestError('Error: unexpected input type.');
    }

    return input;
  },

  checkInputNotNil: (logger) => (input) => {
    if (R.isNil(input)) {
      logger.error('Error: No data was provided.');
      throw new restifyErrors.BadRequestError('Error: No data was provided.');
    }

    return input;
  },

  /**
   * Some of it checked via CASL for req.body
   * but this also covers req.params and req.query
   */
  checkEachInputIsExpected: (logger, validation) => (input) => {
    R.forEachObjIndexed(
      (value, key) => {
        if (!validation[key]) {
          logger.error(`Error: insupported input: ${key}`);
          throw new restifyErrors.BadRequestError(`Error: insupported input: ${key}`);
        }
      },
      input,
    );

    return input;
  },

  checkRequiredInputIsPresent: (logger, validation) => (input) => {
    R.forEachObjIndexed(
      (value, key) => {
        if (value.required && R.isNil(input[key])) {
          if (input[key] === null && value.allowNull) {
            return;
          }
          logger.error(`Error: Required data ${key} missing.`);
          throw new restifyErrors.BadRequestError(`Error: Required data ${key} missing.`);
        }
      },
      validation,
    );

    return input;
  },

  validateEachInput: (logger, validation) => (input) => {
    R.forEachObjIndexed(
      (value, key) => {
        if (R.type(value) === 'Null') {
          if (validation[key].allowNull) {
            return;
          }

          logger.error(`Error: null not allow for: ${key}`);
          throw new restifyErrors.BadRequestError(`Error: null not allow for: ${key}`);
        }

        if (!validation[key].validator(value)) {
          logger.error(`Error: insupported input format for: ${key}`);
          throw new restifyErrors.BadRequestError(`Error: insupported input format for: ${key}`);
        }
      },
      input,
    );

    return input;
  },
};
