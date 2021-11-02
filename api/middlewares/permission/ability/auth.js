const { AbilityBuilder, Ability } = require('@casl/ability');
const { Auth } = require('../../../resources/entities');

module.exports = () => {
  const { can: allow, build } = new AbilityBuilder(Ability);

  allow(
    'signup',
    'Auth',
    Auth.rules.signup,
  );

  allow(
    'signin',
    'Auth',
    Auth.rules.signin,
  );

  return build();
};
