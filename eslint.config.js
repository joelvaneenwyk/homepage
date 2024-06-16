/**
 * ESLint flat configuration
 */

// @ts-check

import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(eslint.configs.recommended, ...tseslint.configs.recommended, {
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
    }
  },
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
  }
});
