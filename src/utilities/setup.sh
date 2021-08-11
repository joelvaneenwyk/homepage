#!/usr/bin/env bash

#
# docker run --rm -it -v %cd%:/usr/src/project ubuntu bash -c "bash --init-file <(echo 'cd /usr/src/project')"
#

set -e

apt-get update
apt-get install -y sudo wget build-essential git curl

# Install Golang
wget https://dl.google.com/go/go1.16.7.linux-amd64.tar.gz
sudo tar -xvf go1.16.7.linux-amd64.tar.gz
sudo mv go /usr/local
export GOROOT="/usr/local/go"
export PATH="${GOPATH}/bin:${GOROOT}/bin:${PATH}"
go version

# Install NodeJS
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Hugo
git clone -b "v0.87.0" "https://github.com/gohugoio/hugo.git" "hugo"
cd hugo || true
go install --tags extended
hugo --version

# Install Yarn
npm install -g Yarn

# Install TypeScript and 'tsc'
yarn global add typescript
