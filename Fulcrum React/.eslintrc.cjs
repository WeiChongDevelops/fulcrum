module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaFeatures: { jsx: true }, ecmaVersion: "latest", sourceType: "module", project: true },
  plugins: ["react", "react-hooks"],
  rules: {
    "react-refresh/only-export-components": "warn",
  },
  settings: {
    react: {
      version: "detect"
    },
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"]
    },
  ],
};
