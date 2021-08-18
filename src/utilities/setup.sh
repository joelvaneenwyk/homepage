#!/usr/bin/env bash

#
# docker run --rm -it -v %cd%:/usr/src/project heroku/heroku:20 bash -c "bash --init-file <(echo 'cd /usr/src/project')"
#

set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && cd ../../ && pwd)"
ENV_SETUP="$ROOT_DIR/src/utilities/env.sh"

function _add_profile_hook() {
    _env="$(printf "\n. \"%s\"\n" "$ENV_SETUP")"
    if grep -q "env.sh" "$HOME/.profile"; then
        echo "Profile already updated."
    else
        printf "%s" "$_env" >> "$HOME/.profile"
        echo "Added homepage environment script to profile."

        echo "------------------------------"
        ls -la "$ROOT_DIR"

        echo "------------------------------"
        ls -la "$ROOT_DIR/.yarn"

        echo "------------------------------"
    fi

    # shellcheck source=env.sh
    . "$ENV_SETUP"
}

function _sudo() {
    if [ "$(whoami)" == "root" ]; then
        "$@"
    else
        if [ ! -x "$(command -v sudo)" ]; then
            echo "Installing missing 'sudo' command"
            mkdir -p "/var/lib/apt/lists/partial"
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
_apt_get update
_apt_get install -y wget build-essential gcc g++ make git curl

if [ -x "$(command -v go)" ]; then
    _go_version=$(go version | { read -r _ _ v _; echo "${v#go}"; })
    go_minor=$(echo "$_go_version" | cut -d. -f2)
fi

if [ ! -x "$(command -v go)" ] || (( go_minor < 16 )); then
    _go_version="1.17"
    _go_archive="go$_go_version.linux-amd64.tar.gz"

    # Install Golang
    if [ ! -f "$_tmp/$_go_archive" ]; then
        wget "https://dl.google.com/go/$_go_archive" --directory-prefix="$_tmp/"
    fi

    rm -rf "$_tmp/go"
    if tar -xvf "$_tmp/$_go_archive" --directory "$_tmp/" >/dev/null 2>&1; then
        _sudo rm -rf "/usr/local/go"
        _sudo mv "$_tmp/go" "/usr/local"
        echo "Updated 'go' install: '/usr/local/go'"

        # shellcheck source=env.sh
        . "$ENV_SETUP"
    else
        echo "Failed to extarct 'go' archive."
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
    curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | _sudo tee /usr/share/keyrings/yarnkey.gpg >/dev/null
    echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main" | _sudo tee /etc/apt/sources.list.d/yarn.list
    _apt_get update && _apt_get -y install yarn
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
