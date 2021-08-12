#!/usr/bin/env bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
ROOT_DIR="$SCRIPT_DIR/../../"

rm -f "$ROOT_DIR/.gitignore"
rm -rf "$ROOT_DIR/.git"
