import config from '@jgarber/eslint-config';

export default [
  ...config,
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        console: 'readonly',
        fetch: 'readonly'
      }
    },
    rules: {
      'unicorn/better-regex': 'off'
    }
  }
];
