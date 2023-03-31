/* eslint-env es6 */
const OFF = 0;
const WARN = 1;
const ERROR = 2;

/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ["@remix-run/eslint-config/internal", "plugin:markdown/recommended"],
  plugins: ["markdown"],
  settings: {
    "import/internal-regex": "^~/",
  },
  rules: {
    "prefer-let/prefer-let": OFF,
    "prefer-const": WARN,

    "import/order": [
      ERROR,
      {
        alphabetize: { caseInsensitive: true, order: "asc" },
        groups: ["builtin", "external", "internal", "parent", "sibling"],
        "newlines-between": "always",
      },
    ],

    "react/jsx-no-leaked-render": [WARN, { validStrategies: ["ternary"] }],
  },
};
