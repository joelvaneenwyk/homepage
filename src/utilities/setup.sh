#!/usr/bin/env bash

#
# docker run --rm -it -v %cd%:/usr/src/project ubuntu bash -c "bash --init-file <(echo 'cd /usr/src/project')"
#

set -e

if [ ! -x "$(command -v sudo)" ]; then
    apt-get update
    apt-get install -y sudo
else
    sudo apt-get update
fi

apt-get install -y wget build-essential gcc g++ make git curl

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
go version
go env -w GOBIN=/usr/local/go/bin

# Install NodeJS
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Yarn
curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | sudo tee /usr/share/keyrings/yarnkey.gpg >/dev/null
echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn

# Install Hugo
git clone -b "v0.87.0" "https://github.com/gohugoio/hugo.git" "/tmp/hugo"
cd "/tmp/hugo" || true
go install --tags extended
hugo version

# Install TypeScript and 'tsc'
yarn global add typescript
