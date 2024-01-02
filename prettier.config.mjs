// prettier.config.js, .prettierrc.js, prettier.config.mjs, or .prettierrc.mjs

import * as plugin_sh from "prettier-plugin-sh";
import * as plugin_toml from "prettier-plugin-toml";
import * as plugin_eslint from "prettier-eslint";

/** @type {import("prettier").Config} */
const config = {
    semi: true,
    overrides: [
        {
            files: [
                "**/*.js",
                "**/*.ts",
            ],
            options: {
                plugins: [plugin_eslint],
                tabWidth: 4,
                printWidth: 130,
                proseWrap: "preserve"
            }
        },
        {
            files: [
                "**/*.sh"
            ],
            options: {
                plugins: [plugin_sh],
                tabWidth: 4,
                printWidth: 130,
                proseWrap: "preserve"
            }
        },
        {
            files: [
                "**/*.toml"
            ],
            options: {
                plugins: [plugin_toml],
                tabWidth: 4,
                printWidth: 130,
                proseWrap: "preserve"
            }
        },
        {
            files: [
                "**/*.json"
            ],
            options: {
                tabWidth: 4,
                printWidth: 130,
                proseWrap: "preserve"
            }
        },
        {
            files: [
                "content/**/*.md"
            ],
            options: {
                tabWidth: 2,
                printWidth: 130,
                proseWrap: "preserve"
            }
        }
    ],
};

export default config;
