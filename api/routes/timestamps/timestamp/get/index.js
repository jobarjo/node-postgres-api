const R = require('ramda');
const { User } = require('../../../../resources/entities');

module.exports = (req, res, next) => {
  const { targetTimestamp } = req.locals;

  const timestamp = processTimestamp(targetTimestamp);

  res.json(timestamp);

  return next();
};

function processTimestamp(targetTimestamp) {
  return R.evolve({
    user: filterUserFields,
  })(targetTimestamp.toJSON());
}

function filterUserFields(user) {
  return R.pick(User.publicFields, user);
}
