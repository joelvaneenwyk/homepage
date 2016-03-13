@echo off

set NODE="C:\Program Files\nodejs\node.exe"

echo Go to http://localhost:8080/cheeses.html 
%NODE% %~dp0\source\nodejs\server.js