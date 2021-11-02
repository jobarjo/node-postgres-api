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
      firstName: {
        validator: validators.max64Length,
        required: false,
        allowNull: true,
      },
      lastName: {
        validator: validators.max64Length,
        required: false,
        allowNull: true,
      },
      password: {
        validator: validators.password,
        required: false,
        allowNull: false,
      },
      role: {
        validator: validators.role,
        required: false,
        allowNull: false,
      },
    },
  };
}
