@echo off
echo Starting iframe Tester...
cd /d "C:\Users\matts\OneDrive\apps to maek\game-studio"
start "" "http://localhost:3502/iframe-test.html"
npx serve -p 3502 .
