@echo off

setlocal EnableDelayedExpansion

call yarn config set --home enableTelemetry 0
call yarn install
call yarn build
