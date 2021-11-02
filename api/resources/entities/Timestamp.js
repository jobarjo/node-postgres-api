const fields = {
  patchTimestamp: ['userId', 'name', 'city', 'gmtDiff'],
};

const rules = {
  patchTimestamp: {
    basic: ['name', 'city', 'gmtDiff'],
    admin: ['userId', 'name', 'city', 'gmtDiff'],
  },
  createTimestamp: {
    admin: ['userId', 'name', 'city', 'gmtDiff'],
  },
};

module.exports = class Timestamp {
  static fields = fields;

  static rules = rules;

  constructor(attrs) {
    Object.assign(this, attrs);
    this.fields = fields;
  }
};
