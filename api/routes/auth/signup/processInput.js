const validators = require('../../../middlewares/express/request/inputValidation/validators');

module.exports = (req, res, next) => {
  const inputToValidate = { ...req.body };

  req.locals.validationData = prepareValidationData(inputToValidate);

  return next();
};

function prepareValidationData(inputToValidate) {
  return {
    inputToValidate,
    inputValidators: {
      id: {
        validator: validators.email,
        required: true,
        allowNull: false,
      },
      firstName: {
        validator: validators.max64Length,
        required: false,
        allowNull: false,
      },
      lastName: {
        validator: validators.max64Length,
        required: false,
        allowNull: false,
      },
      password: {
        validator: validators.password,
        required: true,
        allowNull: false,
      },
    },
  };
}
