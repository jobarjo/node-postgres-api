const R = require('ramda');
const { User } = require('../../../../resources/entities');

module.exports = (req, res) => {
  const { targetTimestamp } = req.locals;

  const timestamp = processTimestamp(targetTimestamp);

  return res.json(timestamp);
};

function processTimestamp(targetTimestamp) {
  return R.evolve({
    user: filterUserFields,
  })(targetTimestamp.toJSON());
}

function filterUserFields(user) {
  return R.pick(User.publicFields, user);
}
