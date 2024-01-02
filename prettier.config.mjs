// prettier.config.js, .prettierrc.js, prettier.config.mjs, or .prettierrc.mjs

// .vscode/ *.json themes/base/.babelrc hugo.toml src/bin/*.sh

import plugin_xml from '@prettier/plugin-xml';
import plugin_organize_import from 'prettier-plugin-organize-imports';
import plugin_package_json from 'prettier-plugin-packagejson';
import plugin_sh from 'prettier-plugin-sh';
import plugin_toml from 'prettier-plugin-toml';

/** @type {import("prettier").Config} */
const config = {
  plugins: [plugin_sh, plugin_toml, plugin_organize_import, plugin_package_json, plugin_xml],
  singleQuote: true,
  semi: true,
  printWidth: 130,
  trailingComma: 'none',
  proseWrap: 'preserve',
  quoteProps: 'preserve',
  overrides: [
    // Allow proper formatting of JSONC files:
    // https://github.com/prettier/prettier/issues/5708
    {
      files: ['**/*.jsonc', '**/.vscode/*.json', '**/tsconfig.json', '**/tsconfig.*.json'],
      options: {
        parser: 'json5',
        singleQuote: false,
        quoteProps: 'preserve'
      }
    },
    {
      files: ['**/*.sh', '**/*.bash', '**/*.zsh', '**/pre-commit'],
      options: {
        parser: 'sh'
      }
    },
    {
      files: ['**/*.toml'],
      options: {
        parser: 'toml'
      }
    },
    {
      files: ['Procfile', '**/*.yml', '**/*.yaml'],
      options: {
        parser: 'yaml'
      }
    },
    {
      files: ['*.md'],
      parser: 'markdown'
    },

    // Allow proper formatting of XML files:
    // https://github.com/prettier/plugin-xml#configuration
    {
      files: ['**/*.xml'],
      parser: 'xml',
      options: {
        // The default is "strict". However, whitespace cannot be reformatted unless this is set to
        // "ignore".
        xmlWhitespaceSensitivity: 'ignore',

        // Prettier's default value is 80, but this causes XML files in particular to become
        // difficult to work with.
        printWidth: 1_000_000
      }
    }
  ]
};

export default config;
