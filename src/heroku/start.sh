#!/usr/bin/env bash

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && cd ../../ && pwd)"

if [ ! -f "$ROOT_DIR/dist/server/server.js" ]; then
    # shellcheck disable=SC1091
    . "$ROOT_DIR/src/utilities/setup.sh"
else
    # Always setup the environment so that we can find 'golang' and 'hugo'
    # shellcheck disable=SC1091
    . "$ROOT_DIR/src/utilities/env.sh"
fi

yarn run --cwd "$ROOT_DIR" start
