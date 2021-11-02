const { USERS } = require('../../../resources/variables/variables.json');

module.exports = {
  isAdmin: (user) => user?.role === USERS.ROLES.ADMIN,
};
