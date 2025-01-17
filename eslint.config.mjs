import globals from 'globals';
import js from '@eslint/js';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  {
    files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
  },
  {
    ignores: ['node_modules', 'coverage', 'dist', 'frontend/js/**/*'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  js.configs.recommended,
  prettierRecommended,
  {
    rules: {
      'no-console': 'warn',
      'prettier/prettier': [
        'error',
        {
          tabWidth: 2,
          useTabs: false,
          printWidth: 120,
          semi: true,
          singleQuote: true,
        },
      ],
    },
  },
];
