#!/usr/bin/env sh

export LOCAL="$HOME/local"
mkdir -p "$LOCAL" || true

if [ -z "${GOROOT:-}" ]; then
    export GOROOT="$LOCAL/go"
    export GOBIN="$GOROOT/bin"
    export PATH="$GOBIN:$PATH"
fi

if [ -z "${GOPATH:-}" ]; then
    if [  -x "$(command -v go)" ]; then
        GOPATH="$(go env GOPATH)"
        export GOPATH

        go env -w GOROOT="$GOROOT"
        go env -w GOBIN="$GOROOT/bin"
    fi
fi
