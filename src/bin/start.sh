#!/usr/bin/env bash

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && cd ../../ && pwd)"

if [ ! -f "$ROOT_DIR/dist/server/server.js" ]; then
    # shellcheck disable=SC1091
    . "$ROOT_DIR/src/bin/setup.sh"
fi

yarn run --cwd "$ROOT_DIR" start
