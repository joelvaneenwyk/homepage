#!/usr/bin/env bash

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && cd ../../ && pwd)"

# Always setup the environment so that we can find 'golang' and 'hugo'
# shellcheck disable=SC1091
. "$ROOT_DIR/src/utilities/env.sh"

if [ ! -d "$ROOT_DIR/.git" ]; then
    git clone --no-checkout "https://github.com/joelvaneenwyk/homepage.git" "$ROOT_DIR/dist/git"

    # Move the .git folder to the directory with the files.
    # This makes `existing-dir` a git repo.
    mv "$ROOT_DIR/dist/git/.git" "$ROOT_DIR/"
fi

yarn run --cwd "$ROOT_DIR" build
