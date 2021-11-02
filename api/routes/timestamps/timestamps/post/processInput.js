const validators = require('../../../../middlewares/express/request/inputValidation/validators');

module.exports = (req, res, next) => {
  const inputToValidate = { ...req.body };

  req.locals.validationData = prepareValidationData(inputToValidate);

  return next();
};

function prepareValidationData(inputToValidate) {
  return {
    inputToValidate,
    inputValidators: {
      userId: {
        validator: validators.email,
        required: true,
        allowNull: false,
      },
      name: {
        validator: validators.max255LengthMin0,
        required: true,
        allowNull: false,
      },
      city: {
        validator: validators.max64Length,
        required: true,
        allowNull: false,
      },
      gmtDiff: {
        validator: validators.gmtDiff,
        required: true,
        allowNull: false,
      },
    },
  };
}
