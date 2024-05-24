#!/usr/bin/env bash

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && cd ../../ && pwd)"

rm -rf "$ROOT_DIR/dist" > /dev/null 2>&1 || true
rm -rf "$ROOT_DIR/resources" > /dev/null 2>&1 || true
rm -rf "$ROOT_DIR/.yarn/cache" > /dev/null 2>&1 || true

# shellcheck disable=SC1091
. "$ROOT_DIR/src/bin/setup.sh"

cd "$ROOT_DIR" || true
yarn install
yarn run heroku-prebuild
yarn run build
yarn run heroku-postbuild
yarn run heroku-cleanup
yarn run start
