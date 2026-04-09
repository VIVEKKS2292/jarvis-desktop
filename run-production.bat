@echo off
REM JARVIS Desktop - Production Launch Script
REM This script builds and runs the app in production mode

echo Building React application...
call npm run build

if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo.
echo Starting JARVIS in production mode...
set NODE_ENV=production
call npm start

pause
