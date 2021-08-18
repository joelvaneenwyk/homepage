#!/usr/bin/env bash

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && cd ../../ && pwd)"

echo [heroku] Runs after Heroku installs dependencies but before Heroku prunes and caches dependencies.

if [ ! -f "$ROOT_DIR/dist/index.html" ]; then
    echo "ERROR: Hugo site generation failed. Missing 'index.html' starting page."
    return 1
fi

if [ ! -f "$ROOT_DIR/dist/server/server.js" ]; then
    echo "ERROR: Production server missing: '$ROOT_DIR/dist/server/server.js'"
    return 2
fi
