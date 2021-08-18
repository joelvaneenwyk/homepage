#!/usr/bin/env bash

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && cd ../../ && pwd)"

rm -rf "$ROOT_DIR/.git" > /dev/null 2>&1 || true
rm -rf "$ROOT_DIR/.yarn/cache" > /dev/null 2>&1 || true
