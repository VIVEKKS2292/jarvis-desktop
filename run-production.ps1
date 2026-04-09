# JARVIS Desktop - Production Launch Script (PowerShell)
# This script builds and runs the app in production mode

Write-Host "Building React application..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Starting JARVIS in production mode..." -ForegroundColor Cyan
$env:NODE_ENV = "production"
npm start
