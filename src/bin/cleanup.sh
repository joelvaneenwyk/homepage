#!/usr/bin/env bash

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && cd ../../ && pwd)"

if [ -n "${HEROKU_APP_NAME:-}" ]; then
  echo "Skipped '.git' folder removal since we are running from Heroku ('HEROKU_APP_NAME' is non-empty)."
else
  rm -rf "$ROOT_DIR/.git" > /dev/null 2>&1 || true
fi

rm -rf "$ROOT_DIR/.yarn/cache" > /dev/null 2>&1 || true

if [ ! -f "$ROOT_DIR/dist/www/index.html" ]; then
  echo "ERROR: Hugo site generation failed. Missing 'index.html' starting page."
  exit 1
fi

if [ ! -f "$ROOT_DIR/dist/server/server.js" ]; then
  echo "ERROR: Production server missing: '$ROOT_DIR/dist/server/server.js'"
  exit 2
fi
