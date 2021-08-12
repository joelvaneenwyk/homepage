#!/usr/bin/env bash

#
# docker run --rm -it -v %cd%:/usr/src/project ubuntu bash -c "bash --init-file <(echo 'cd /usr/src/project')"
#

set -e

echo "Initiated setup process for homepage."

if [ ! -x "$(command -v sudo)" ]; then
    echo "Installing missing 'sudo' command"
    apt-get update
    apt-get install -y sudo
else
    sudo apt-get update
fi

sudo apt-get install -y wget build-essential gcc g++ make git curl

if [ ! -x "$(command -v go)" ]; then
    # Install Golang
    if [ ! -f "/tmp/go1.16.7.linux-amd64.tar.gz" ]; then
        wget https://dl.google.com/go/go1.16.7.linux-amd64.tar.gz --directory-prefix=/tmp/
    fi

    if [ ! -d "/usr/local/go" ]; then
        sudo tar -xvf "/tmp/go1.16.7.linux-amd64.tar.gz" --directory "/tmp/"
        sudo mv "/tmp/go" "/usr/local"
    fi

    export GOROOT="/usr/local/go"
    export PATH=$PATH:/usr/local/go/bin
    go env -w GOBIN=/usr/local/go/bin
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
    sudo apt-get update && sudo apt-get install yarn
fi

# Install Hugo
if [ ! -x "$(command -v yarn)" ]; then
    git clone -b "v0.87.0" "https://github.com/gohugoio/hugo.git" "/tmp/hugo"
    cd "/tmp/hugo" || true
    go install --tags extended
fi
hugo version
