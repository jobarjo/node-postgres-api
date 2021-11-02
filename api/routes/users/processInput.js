const validators = require('../../middlewares/express/request/inputValidation/validators');

module.exports = (req, res, next) => {
  const inputToValidate = {
    targetUserId: req.params?.targetUserId,
  };

  req.locals.validationData = prepareValidationData(inputToValidate);

  req.locals.targetUserId = req.params?.targetUserId;

  return next();
};

function prepareValidationData(inputToValidate) {
  return {
    inputToValidate,
    inputValidators: {
      targetUserId: {
        validator: validators.email,
        required: true,
        allowNull: false,
      },
    },
  };
}
