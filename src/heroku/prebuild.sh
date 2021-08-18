#!/usr/bin/env bash

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && cd ../../ && pwd)"

_env="$(printf "\n. \"%s/src/utilities/env.sh\"\n" "$ROOT_DIR")"
if grep -q "env.sh" "$HOME/.profile"; then
    echo "Profile already updated."
else
    printf "%s" "$_env" >> "$HOME/.profile"
fi

# shellcheck disable=SC1091
. "$ROOT_DIR/src/utilities/setup.sh"
