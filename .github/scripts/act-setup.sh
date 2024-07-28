#!/bin/sh
# This contains various workarounds for running GitHub actions
# locally using 'act' tool either directly or through 'gh act'
# plugin.

# Workarounds for ACT e.g.,

if [ ! -e "$(command -v sudo)" ]; then
    apt-get update && apt-get install -y sudo
fi

(
    sudo apt-get update
    sudo apt-get install -y wget curl bash
) || true

if curl -sS https://webi.sh/node | bash; then
    # shellcheck disable=SC1091
    . "${HOME:-/root}/.config/envman/PATH.env"
    echo "${HOME:-/root}/.local/opt/node/bin" >>"$GITHUB_PATH"
    echo "${HOME:-/root}/.local/bin" >>"$GITHUB_PATH"
fi
if [ ! -e "$(command -v npm)" ]; then
    export npm_debug=1
    curl -L https://npmjs.org/install.sh | bash
    echo "${HOME:-/root}/.local/opt/node/lib/node_modules/npm/bin" >>"$GITHUB_PATH"
fi
#   - https://github.com/nektos/act/issues/1929#issuecomment-2160717293

mkdir -p "$HOME"/.act
echo "--artifact-server-path $HOME/.act" >>"$HOME"/.actrc
