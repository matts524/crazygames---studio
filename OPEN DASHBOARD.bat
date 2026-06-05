@echo off
echo.
echo  ========================================
echo   Game Studio Dashboard
echo  ========================================
echo.
cd /d "C:\Users\matts\OneDrive\apps to maek\game-studio"

echo  Checking dependencies...
call npm install --silent 2>nul
if errorlevel 1 (
  echo  Installing dependencies first...
  call npm install
)

echo  Starting server at http://localhost:3500
echo  Opening dashboard in your browser...
echo.
echo  Tool approvals will download and integrate automatically.
echo  Keep this window open. Press Ctrl+C to stop.
echo.
start "" "http://localhost:3500/dashboard.html"
node server.js
