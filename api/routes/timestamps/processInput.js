const validators = require('../../middlewares/express/request/inputValidation/validators');

module.exports = (req, res, next) => {
  const inputToValidate = {
    targetTimestampId: req.params?.targetTimestampId,
  };

  req.locals.validationData = prepareValidationData(inputToValidate);

  req.locals.targetTimestampId = req.params?.targetTimestampId;

  return next();
};

function prepareValidationData(inputToValidate) {
  return {
    inputToValidate,
    inputValidators: {
      targetTimestampId: {
        validator: validators.uuid,
        required: true,
        allowNull: false,
      },
    },
  };
}
