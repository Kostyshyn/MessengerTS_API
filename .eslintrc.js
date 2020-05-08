module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: [
    '@typescript-eslint'
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    '@typescript-eslint/no-use-before-define': 1,
    '@typescript-eslint/camelcase': 0
  }
}

