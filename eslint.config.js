const config = require('@jgarber/eslint-config');

module.exports = [
  ...config,
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        console: 'readonly'
      }
    }
  }
];
