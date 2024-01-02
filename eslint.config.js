/**
 * ESLint flat configuration
 */

import js from '@eslint/js';
import typescript_plugin from '@typescript-eslint/eslint-plugin';
import typescript_parser from '@typescript-eslint/parser';
import globals from 'globals';

/** @type {import("eslint").ESLint.ConfigData} */
const config = {
  languageOptions: {
    ecmaVersion: 2018,
    globals: {
      // browser: true,
      // commonjs: true,
      // es6: true,
      // jquery: true,
      // node: true
      Atomics: 'readonly',
      SharedArrayBuffer: 'readonly',
      ...globals.browser
    },
    parser: typescript_parser
  },
  plugins: {
    typescript: typescript_plugin
  },
  files: ['**/*.ts'],
  ignores: ['dist/**'],
  rules: {
    'indent': ['error', 4],
    'max-len': [
      'error',
      {
        code: 130
      }
    ],
    'linebreak-style': 'off',
    'quotes': ['error', 'double'],
    'semi': ['error', 'always'],
    'arrow-body-style': ['error', 'as-needed'],
    'prefer-arrow-callback': 'off',
    'sort-imports': 'off',
    'no-cond-assign': ['error', 'always'],
    'import/first': 'off',
    'comma-dangle': [
      'error',
      {
        arrays: 'never',
        objects: 'never',
        imports: 'never',
        exports: 'never',
        functions: 'never'
      }
    ],
    'no-console': 'off'
  },
  // ...airbnb-base
  ...js.configs.recommended
};

export default [config];
