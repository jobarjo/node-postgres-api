const fields = {
  signup: ['id', 'firstName', 'lastName', 'password'],
  signin: ['id', 'password'],
};

const rules = {
  signup: ['id', 'firstName', 'lastName', 'password'],
  signin: ['id', 'password'],
};

module.exports = class Auth {
  static fields = fields;

  static rules = rules;

  constructor(attrs) {
    Object.assign(this, attrs);
    this.fields = fields;
  }
};
