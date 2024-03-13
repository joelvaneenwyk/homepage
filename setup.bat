@echo off && goto:$Main

:$Main
setlocal EnableDelayedExpansion
    call yarn config set --home enableTelemetry 0
    call yarn install

    set "CGO_ENABLED=1"
    call proto run go -- run -tags extended github.com/gohugoio/hugo@v0.123.8

    :: call yarn build
endlocal & exit /b %errorlevel%
