module.exports = {
  extends: 'airbnb-base',
  rules: {
    'no-use-before-define': 'off',
    camelcase: ['error', {
      properties: 'never',
      ignoreDestructuring: true,
    }],
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
  },
};
