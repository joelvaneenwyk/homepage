#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
ROOT_DIR="$SCRIPT_DIR/../../"

echo "Joel Van Eenwyk - Homepage Release"

echo "------------------------------"
ls -la "$ROOT_DIR"

echo "------------------------------"
cd "$ROOT_DIR" || true
yarn --cwd "$ROOT_DIR" workspaces focus --production

echo "------------------------------"
ls -la "$ROOT_DIR/.yarn"

echo "------------------------------"
echo "Release process complete."
