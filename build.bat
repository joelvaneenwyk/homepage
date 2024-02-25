@echo off
goto:$Main

:$Main
setlocal EnableDelayedExpansion
    set "_hugo=%USERPROFILE%\scoop\shims\hugo.exe"
    cd /d "%~dp0"
    "!_hugo!" ^
        --forceSyncStatic ^
        --buildDrafts --buildExpired --buildFuture ^
        --cleanDestinationDir --verbose --gc --enableGitInfo
endlocal & exit /b %errorlevel%

::
:: --baseURL string
:: --buildDrafts
:: --buildExpired
:: --buildFuture
:: --cacheDir string
:: --cleanDestinationDir
:: --config string
:: --configDir string
:: --contentDir string
:: --debug
:: --destination string
:: --disableKinds strings
:: --enableGitInfo
:: --environment string
:: --forceSyncStatic
:: --gc
:: --help
:: --ignoreVendorPaths string
:: --layoutDir string
:: --logLevel string
:: --minify
:: --noBuildLock
:: --noChmod
:: --noTimes
:: --panicOnWarning
:: --printI18nWarnings
:: --printMemoryUsage
:: --printPathWarnings
:: --printUnusedTemplates
:: --quiet
:: --renderToMemory
:: --source string
:: --templateMetrics
:: --templateMetricsHints
:: --theme strings
:: --themesDir string
:: --trace file
:: --verbose
:: --watch
::
