module.exports = {
  extends: "airbnb-base",
  env: {
    browser: true,
    jest: true
  },
  rules: {
    'max-len': ['error', { code: 80 }],
    'import/prefer-default-export': 0
  }
};

