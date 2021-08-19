#!/usr/bin/env bash

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && cd ../../ && pwd)"

# Always setup the environment so that we can find 'golang' and 'hugo'
# shellcheck disable=SC1091
. "$ROOT_DIR/src/utilities/env.sh"

yarn run --cwd "$ROOT_DIR" build
