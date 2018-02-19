@echo off

set HOME=%~dp0
set JVE_THIRDPARTY=%HOME%\thirdparty
set PATH=%PATH%

echo ==============================================================================
echo  Joel Van Eenwyk (Homepage)
echo ==============================================================================
echo.
echo 1) Install NodeJS / npm (https://nodejs.org/en/)
echo 2) Install Heroku CLI (https://devcenter.heroku.com/articles/heroku-cli)
echo 3) Run 'npm install -g grunt'
echo 4) Run 'npm update'
echo 5) Run 'npm install'
echo 6) Run 'heroku local' to start the server
echo.
echo ==============================================================================
echo.

%~d0
cd %~dp0

cmd