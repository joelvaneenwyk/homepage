@echo off
goto:$Main

:$Main
setlocal EnableDelayedExpansion
    call scoop install "hugo-extended"
    call yarn config set --home enableTelemetry false
    call yarn install
    call yarn build
endlocal & exit /b %errorlevel%
