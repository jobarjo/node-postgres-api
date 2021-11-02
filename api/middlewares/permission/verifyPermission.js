const R = require('ramda');
const restifyErrors = require('restify-errors');
const { permittedFieldsOf } = require('@casl/ability/extra');
const { User } = require('../../resources/entities');
const defineAbilityFor = require('./ability/index');
const defineTarget = require('./target/defineTarget');

module.exports = (path, action) => async (req, res, next) => {
  const { logger, requestUser } = req.locals;

  const user = defineUser(requestUser);

  const ability = defineAbilityFor(logger, path, user);

  const target = defineTarget(logger, req.locals, path);

  const isAllowed = defineIfOperationIsAllowed(
    req.body, user, ability, action, target,
  );

  if (!isAllowed) {
    const errMessage = 'user is not allowed to perform this operation.';
    logger.error(`[MW-verifyUserPermission] ${errMessage}`);
    return next(new restifyErrors.ForbiddenError(errMessage));
  }

  return next();
};

function defineIfOperationIsAllowed(reqBody, user, ability, action, target) {
  const isActionAllowed = ability.can(action, target);

  /**
   * For actions involving fields (such as patch or post),
   * we check that the user is allowed to act on the requested fields
   * NB: target can be undefinied for action not requiring subject (homescreen)
   */
  const areFieldsPermitted = target?.fields[action]
    ? checkFieldsArePermitted(reqBody, user, ability, action, target)
    : true;

  const isAllowed = isActionAllowed && areFieldsPermitted;

  return isAllowed;
}

function checkFieldsArePermitted(reqBody, user, ability, action, target) {
  const keyToVerify = R.keys(reqBody);
  const options = setOptions(user, target, action);
  const permittedFields = permittedFieldsOf(ability, action, target, options);

  const areFieldsPermitted = keyToVerify.every((key) => R.includes(key, permittedFields));

  return areFieldsPermitted;
}

/**
 * Necessary because requestUser is not defined for auth endpoints
 */
function defineUser(requestUser) {
  return requestUser
    ? new User({ ...requestUser.toJSON() })
    : new User();
}

function setOptions(user, target, action) {
  const availableFields = target.fields[action];

  const fieldsFrom = (rule) => rule.fields || availableFields;

  return { fieldsFrom };
}
