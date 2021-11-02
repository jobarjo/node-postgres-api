const { AbilityBuilder, Ability } = require('@casl/ability');
const { isAdmin } = require('../utils/utils');
const { Timestamp } = require('../../../resources/entities');

module.exports = (user) => {
  const { can: allow, build } = new AbilityBuilder(Ability);

  if (isAdmin(user)) {
    allow(
      'getTimestamps',
      'Timestamp',
    );
    allow(
      'createTimestamp',
      'Timestamp',
      Timestamp.rules.createTimestamp.admin,
    );
  }

  allow(
    'getTimestamp',
    'Timestamp',
    {
      userId: user.id,
    },
  );
  if (isAdmin(user)) {
    allow(
      'getTimestamp',
      'Timestamp',
    );
  }

  allow(
    'patchTimestamp',
    'Timestamp',
    Timestamp.rules.patchTimestamp.basic,
    {
      userId: user.id,
    },
  );
  if (isAdmin(user)) {
    allow(
      'patchTimestamp',
      'Timestamp',
      Timestamp.rules.patchTimestamp.admin,
    );
  }

  allow(
    'deleteTimestamp',
    'Timestamp',
    {
      userId: user.id,
    },
  );
  if (isAdmin(user)) {
    allow(
      'deleteTimestamp',
      'Timestamp',
    );
  }

  return build();
};
