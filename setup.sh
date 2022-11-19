#!/bin/sh

_install_hugo() {
    if [ -x "$(command -v go)" ]; then
        go install -tags extended github.com/gohugoio/hugo@latest
    fi
}

_setup() {
    if [ ! -x "$(command -v hugo)" ]; then
        _install_hugo
    fi

    if hugo version | grep -q 'extended'; then
        echo "Hugo extended version is installed."
    else
        _install_hugo
    fi

    hugo version

    yarn install

    hugo
}

_setup
