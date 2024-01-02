/**
 * ESLint flat configuration
 */

import js from "@eslint/js";

/** @type {import("eslint").ESLint.ConfigData} */
const config = {
    files: ["**/src/safe/*.js"],
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        jquery: true,
        node: true
    },
    //"extends": [
    //    "airbnb-base"
    //],
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly"
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2018
    },
    plugins: ["@typescript-eslint"],
    ignorePatterns: ["themes/base/assets/lib/**", "dist/**", "**/*.min.js", "**/newrelic.js"],
    rules: {
        indent: ["error", 4],
        "max-len": [
            "error",
            {
                code: 130
            }
        ],
        "linebreak-style": "off",
        quotes: ["error", "double"],
        semi: ["error", "always"],
        "arrow-body-style": ["error", "as-needed"],
        "prefer-arrow-callback": "off",
        "sort-imports": "off",
        "no-cond-assign": ["error", "always"],
        "import/first": "off",
        "comma-dangle": [
            "error",
            {
                arrays: "never",
                objects: "never",
                imports: "never",
                exports: "never",
                functions: "never"
            }
        ],
        "no-console": "off"
    },
    ...js.configs.recommended
};

export default [config];
