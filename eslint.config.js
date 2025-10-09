// {
//   "env": {
//     "browser": true,
//     "es2021": true,
//     "node": true
//   },
//   "extends": [
//     "eslint:recommended",
//     "plugin:prettier/recommended"
//   ],
//   "plugins": ["prettier"],
//   "rules": {
//     "prettier/prettier": "error",
//     "complexity": ["warn", { "max": 5 }]
//   }
// }

// eslint.config.js
// eslint.config.js
const js = require("@eslint/js");
// const prettier = require("eslint-config-prettier");

module.exports = [
  js.configs.recommended,
  // prettier,
  {
    rules: {
      complexity: ["warn", { max: 12 }],
      // "prettier/prettier": "error"
    }
  },
];
