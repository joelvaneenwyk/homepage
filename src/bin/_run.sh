#!/usr/bin/env bash

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && cd ../../ && pwd)"

rm -rf "$ROOT_DIR/dist" > /dev/null 2>&1 || true
rm -rf "$ROOT_DIR/resources" > /dev/null 2>&1 || true
rm -rf "$ROOT_DIR/.yarn/cache" > /dev/null 2>&1 || true

# shellcheck disable=SC1091
. "$ROOT_DIR/src/bin/setup.sh"

yarn install --cwd "$ROOT_DIR"
yarn run --cwd "$ROOT_DIR" heroku-prebuild
yarn run --cwd "$ROOT_DIR" build
yarn run --cwd "$ROOT_DIR" heroku-postbuild
yarn run --cwd "$ROOT_DIR" heroku-cleanup
yarn run --cwd "$ROOT_DIR" start
