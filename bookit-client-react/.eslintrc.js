const path = require('path')

module.exports = {
  "parser": "babel-eslint",
  "env": {
    "node": true,
    "browser": true,
    "es6": true,
    "mocha": true
  },
  "globals": {
    "jest": true,
    "expect": true,
    "chai": true,
    "fixture": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:react/recommended"
  ],
  "plugins": [
    "import",
    "react"
  ],
  "settings": {
    "import/resolver": {
      "webpack": {
        "config": path.resolve(__dirname, "webpack.config.js")
      }
    }
  },
  "rules": {
    "semi": [ 2, "never" ],
    "indent": [ 2, 2 ],
    "no-console": 0,
    "arrow-parens": [ 1, "as-needed", { "requireForBlockBody": true } ],
    "comma-dangle": [ 2, {
      "arrays": "always-multiline",
      "objects": "always-multiline",
      "imports": "always-multiline",
      "exports": "always-multiline",
      "functions": "never"
    }],
    "react/no-children-prop": 0,
    "react/prop-types": [1, { "ignore": [ "children" ] }]
  },
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module"
  }
}
