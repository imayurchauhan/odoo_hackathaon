@echo off
REM GearGuard Backend Diagnostics Script for Windows

echo.
echo 🔧 GearGuard Backend Diagnostics
echo =================================
echo.

echo Checking Node.js version...
node --version
echo.

echo Checking NPM version...
npm --version
echo.

echo Checking MongoDB connection...
REM Simple check if mongod is running by trying to connect
mongosh "mongodb://127.0.0.1:27017" --eval "db.version()" >nul 2>&1 && (
    echo ✅ MongoDB is running
) || (
    echo ❌ MongoDB is NOT running or not accessible
    echo.
    echo    To start MongoDB:
    echo    - Windows: mongod ^(in another terminal^)
    echo    - Or: net start MongoDB
)

echo.
echo =================================
echo Common Issues & Fixes:
echo =================================
echo.
echo 1. MongoDB not running?
echo    Run: mongod
echo.
echo 2. Dependencies missing?
echo    Run: npm install
echo.
echo 3. Port 5000 in use?
echo    Check: netstat -ano ^| findstr :5000
echo    Kill:  taskkill /PID [PID] /F
echo    Or change PORT in .env
echo.
echo 4. Database empty?
echo    Run: npm run seed
echo.
echo 5. Server won't start?
echo    Check: npm run dev  ^(for detailed errors^)
echo.
echo =================================
echo Next Steps:
echo =================================
echo.
echo 1. Ensure MongoDB is running
echo 2. cd d:\odoo_hackathaon\backend
echo 3. npm install
echo 4. npm run seed
echo 5. npm run dev
echo.
pause
