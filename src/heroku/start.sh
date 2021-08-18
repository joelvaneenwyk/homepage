#!/usr/bin/env bash

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && cd ../../ && pwd)"

# shellcheck disable=SC1091
. "$ROOT_DIR/src/utilities/setup.sh"

yarn run --cwd "$ROOT_DIR" start
