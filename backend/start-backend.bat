@echo off
cd /d d:\odoo_hackathaon\backend
echo Installing backend dependencies...
call npm install
echo.
echo ✅ Dependencies installed!
echo.
echo Starting backend server...
call npm start
pause
