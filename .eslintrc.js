module.exports = {
  "extends": "airbnb",
  "plugins": [
    "react",
    "jsx-a11y",
    "import"
  ],
  "env": {
    "browser": true,
    "jest": true,
  },
  "rules": {
    "max-len": ["error", { "code": 80 }]
  }
};
