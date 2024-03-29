#!/usr/bin/env bash

#
# docker run --rm -it -v %cd%:/usr/src/project heroku/heroku:20 bash -c "bash --init-file <(echo 'cd /usr/src/project')"
#

set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && cd ../../ && pwd)"
ENV_SCRIPT="env.sh"
ENV_SCRIPT_PATH="$ROOT_DIR/src/bin/$ENV_SCRIPT"

function _add_profile_hook() {
    _env="$(printf "\n. \"%s\"\n" "$ENV_SCRIPT_PATH")"
    _profile="$HOME/.profile"

    mkdir -p "$(dirname "$_profile")"
    touch "$_profile"

    if grep -q "$ENV_SCRIPT" "$_profile"; then
        echo "Profile already updated."
    else
        printf "%s" "$_env" >> "$_profile"
        echo "Added homepage environment script to profile."

        echo "------------------------------"
        ls -la "$ROOT_DIR"

        echo "------------------------------"
        ls -la "$ROOT_DIR/.yarn"

        echo "------------------------------"
    fi

    # shellcheck source=./src/bin/env.sh
    . "$ENV_SCRIPT_PATH"
}

function _is_heroku_instance() {
    if [ "$(whoami)" == "app" ]; then
        return 0
    fi

    if [ ! -d "/var/lib/apt/lists/partial" ]; then
        if ! mkdir -p "/var/lib/apt/lists/partial"; then
            return 0
        fi
    fi

    return 1
}

function _sudo() {
    if [ "$(whoami)" == "root" ] || _is_heroku_instance; then
        "$@"
    else
        if [ ! -x "$(command -v sudo)" ]; then
            apt-get update
            apt-get install -y sudo
        fi

        sudo PATH="$PATH" GOROOT="${GOROOT:-}" GOBIN="${GOBIN:-}" GOPATH="${GOPATH:-}" -E "$@"
    fi
}

function _apt_get() {
    _sudo apt-get "$@"
}

_tmp="$HOME/.tmp"
mkdir -p "$_tmp"

echo "Initiated homepage setup: '$ROOT_DIR'"
_add_profile_hook

if _is_heroku_instance; then
    echo "Skipping package download as we are running in Heroku instance."
else
    _apt_get update
    _apt_get install -y wget build-essential gcc g++ make git curl
fi

if [ -x "$(command -v go)" ]; then
    _go_version=$(go version | {
        read -r _ _ v _
        echo "${v#go}"
    })
    go_minor=$(echo "$_go_version" | cut -d. -f2)
fi

if [ ! -x "$(command -v go)" ] || ((go_minor < 16)); then
    _go_version="1.17"
    _go_archive="go$_go_version.linux-amd64.tar.gz"

    # Install Golang
    if [ ! -f "$_tmp/$_go_archive" ]; then
        wget --quiet "https://dl.google.com/go/$_go_archive" --directory-prefix="$_tmp/"
    fi

    rm -rf "$_tmp/go"
    if tar -xvf "$_tmp/$_go_archive" --directory "$_tmp/" > /dev/null 2>&1; then
        if ! _is_heroku_instance; then
            _sudo rm -rf "$GOROOT"
        fi

        if [ ! -d "$GOROOT" ]; then
            _sudo cp -r "$_tmp/go" "$LOCAL"
            echo "Updated 'go' install: '$GOROOT'"
        fi

        # shellcheck source=env.sh
        . "$ENV_SCRIPT_PATH"
    else
        echo "Failed to extract 'go' archive."
    fi
fi
go version

# Install NodeJS
if [ ! -x "$(command -v node)" ] || [ ! -x "$(command -v npm)" ]; then
    curl -fsSL https://deb.nodesource.com/setup_current.x | _sudo bash -
    _apt_get install -y nodejs
fi

# Install Yarn
if [ ! -x "$(command -v yarn)" ]; then
    curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | _sudo tee /usr/share/keyrings/yarn_key.gpg > /dev/null
    echo "deb [signed-by=/usr/share/keyrings/yarn_key.gpg] https://dl.yarnpkg.com/debian stable main" | _sudo tee /etc/apt/sources.list.d/yarn.list
    _apt_get update
    _apt_get -y install yarn
fi

# Install Hugo
if [ ! -x "$(command -v hugo)" ]; then
    rm -rf "$_tmp/hugo"
    git -c advice.detachedHead=false clone -b "v0.87.0" "https://github.com/gohugoio/hugo.git" "$_tmp/hugo"

    _pwd=$(pwd)
    cd "$_tmp/hugo"

    if _sudo "$GOBIN/go" install --tags extended; then
        echo "Installed 'hugo' static site generator."
    else
        echo "Failed to install 'hugo' static site generator."
    fi

    # Restore current directory
    cd "$_pwd"
fi
hugo version
