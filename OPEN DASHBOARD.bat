@echo off
echo.
echo  ========================================
echo   Game Studio Dashboard
echo  ========================================
echo.
echo  Starting server at http://localhost:3500
echo  Opening dashboard in your browser...
echo.
echo  Keep this window open while using the dashboard.
echo  Press Ctrl+C to stop.
echo.
cd /d "C:\Users\matts\OneDrive\apps to maek\game-studio"
start "" "http://localhost:3500/dashboard.html"
node server.js
