const { User } = require('../../../../resources/entities');
const { isAdmin } = require('../../../../middlewares/permission/utils/utils');

module.exports = (req, res) => {
  const { targetUser, requestUser } = req.locals;

  const user = filterPublicFields(targetUser, requestUser);

  return res.json(user);
};

/**
 * Function that retuns all fields if requester is target user or admin
 * If not, will only return public fields
 * Note: password is never sent back
 */
function filterPublicFields(targetUser, requestUser) {
  const userAnswer = targetUser.id === requestUser.id || isAdmin(requestUser)
    ? targetUser.toJSON()
    : filtered(targetUser.toJSON());

  return userAnswer;
}

const filtered = (raw) => Object.keys(raw)
  .filter((key) => User.publicFields.includes(key))
  .reduce((obj, key) => ({
    ...obj,
    [key]: raw[key],
  }), {});
