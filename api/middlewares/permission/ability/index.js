const restifyErrors = require('restify-errors');

const defineAuthAbility = require('./auth');
const defineUserAbility = require('./user');
const defineTimestampAbility = require('./timestamp');

module.exports = (logger, path, user) => {
  let ability;

  const entity = path.split('_')[0];

  switch (entity) {
    case 'auth':
      ability = defineAuthAbility();
      break;
    case 'users':
      ability = defineUserAbility(user);
      break;
    case 'timestamps':
      ability = defineTimestampAbility(user);
      break;
    default:
      // eslint-disable-next-line no-case-declarations
      const errMessage = 'Unexpected permission case.';
      logger.error(`[MW-defineAbility] ${errMessage}`);
      throw new restifyErrors.InternalServerError(errMessage);
  }

  return ability;
};
