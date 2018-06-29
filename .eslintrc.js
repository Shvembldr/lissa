module.exports = {
  extends: ['react-app', 'airbnb-base'],
  env: {
    browser: true,
    jest: true
  },
  rules: {
    'max-len': 'off',
    'import/prefer-default-export': 0,
    'no-shadow': 0,
    'no-console': 0,
    'import/no-extraneous-dependencies': 0
  }
};
