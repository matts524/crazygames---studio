@echo off
echo Starting Gravity Flipper...
cd /d "C:\Users\matts\OneDrive\apps to maek\game-studio"
start "" "http://localhost:3501/games/gravity-flip/index.html"
npx serve -p 3501 .
