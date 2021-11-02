const restifyErrors = require('restify-errors');
const entities = require('../../../resources/entities');

module.exports = (logger, locals, path) => {
  let target;

  switch (path) {
    case 'auth':
      target = new entities.Auth();
      break;
    case 'users_users':
      target = new entities.User();
      break;
    case 'users_user':
    case 'users_timestamps':
      target = new entities.User(locals.targetUser.toJSON());
      break;
    case 'timestamps_timestamps':
      target = new entities.Timestamp();
      break;
    case 'timestamps_timestamp':
      target = new entities.Timestamp(locals.targetTimestamp.toJSON());
      break;
    default:
      // eslint-disable-next-line no-case-declarations
      const errMessage = 'Unexpected permission case.';
      logger.error(`[MW-defineTarget] ${errMessage}`);
      throw new restifyErrors.InternalServerError(errMessage);
  }

  return target;
};
