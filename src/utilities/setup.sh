#!/usr/bin/env bash

#
# docker run --rm -it -v %cd%:/usr/src/project heroku/heroku:20 bash -c "bash --init-file <(echo 'cd /usr/src/project')"
#

set -e

echo "Initiated setup process for homepage."

if [ ! -x "$(command -v sudo)" ]; then
    echo "Installing missing 'sudo' command"

    mkdir -p "/var/lib/apt/lists/partial"

    apt-get update
    apt-get install -y sudo
else
    sudo apt-get update
fi

sudo apt-get install -y wget build-essential gcc g++ make git curl

if [ -x "$(command -v go)" ]; then
    version=$(go version | { read -r _ _ v _; echo "${v#go}"; })
    major=$(echo "$version" | cut -d. -f1)
    minor=$(echo "$version" | cut -d. -f2)
    revision=$(echo "$version" | cut -d. -f3)
    echo "Go v$major.$minor.$revision"
fi

if [ ! -x "$(command -v go)" ] || (( minor < 16 )); then
    # Install Golang
    if [ ! -f "/tmp/go1.16.7.linux-amd64.tar.gz" ]; then
        wget https://dl.google.com/go/go1.16.7.linux-amd64.tar.gz --directory-prefix=/tmp/
    fi

    sudo rm -rf "/tmp/go"
    sudo tar -xvf "/tmp/go1.16.7.linux-amd64.tar.gz" --directory "/tmp/"
    sudo rm -rf "/usr/local/go"
    sudo mv "/tmp/go" "/usr/local"
    echo "Updated 'go' install: '/usr/local/go'"

    export GOROOT="/usr/local/go"
    export GOBIN="$GOROOT/bin"
    export PATH="$GOBIN:$PATH"

    GOPATH="$(go env GOPATH)"
    export GOPATH

    go env -w GOROOT="$GOROOT"
    go env -w GOBIN="$GOROOT/bin"

fi
go version

# Install NodeJS
if [ ! -x "$(command -v node)" ] || [ ! -x "$(command -v npm)" ]; then
    curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install Yarn
if [ ! -x "$(command -v yarn)" ]; then
    curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | sudo tee /usr/share/keyrings/yarnkey.gpg >/dev/null
    echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
    sudo apt-get update && sudo apt-get -y install yarn
fi

# Install Hugo
if [ ! -x "$(command -v hugo)" ]; then
    rm -rf "/tmp/hugo"
    git -c advice.detachedHead=false clone -b "v0.87.0" "https://github.com/gohugoio/hugo.git" "/tmp/hugo"
    cd "/tmp/hugo" || true
    sudo PATH="$PATH" GOROOT="$GOROOT" GOBIN="$GOBIN" GOPATH="$GOPATH" "$GOBIN/go" install --tags extended
fi
hugo version
