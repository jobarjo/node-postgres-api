const fields = {
  patchUser: ['id', 'firstName', 'lastName', 'password', 'role'],
};

const publicFields = ['id', 'firstName', 'lastName'];

const rules = {
  patchUser: {
    basic: ['firstName', 'lastName', 'password'],
    admin: ['firstName', 'lastName', 'password', 'role'],
  },
  createTimestamp: {
    basic: ['name', 'city', 'gmtDiff'],
  },
};

module.exports = class User {
  static fields = fields;

  static publicFields = publicFields;

  static rules = rules;

  constructor(attrs) {
    Object.assign(this, attrs);
    this.fields = fields;
  }
};
