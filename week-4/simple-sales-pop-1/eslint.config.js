import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';

export default [
  // Ignore files
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**']
  },

  // Base JS rules
  js.configs.recommended,

  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {jsx: true}
      }
    },

    plugins: {
      prettier,
      react
    },

    rules: {
      'prettier/prettier': 'error',
      'require-jsdoc': 0,
      'valid-jsdoc': 0,
      camelcase: 0,
      'no-invalid-this': 0,
      'prefer-rest-params': 0
    },

    settings: {
      react: {
        version: 'detect'
      }
    }
  }
];
