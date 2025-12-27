@echo off
echo.
echo ========================================
echo 🔧 GearGuard Setup Instructions
echo ========================================
echo.
echo BACKEND SETUP:
echo 1. Ensure MongoDB is running locally (mongod)
echo 2. Navigate to backend folder:
echo    cd d:\odoo_hackathaon\backend
echo 3. Install dependencies:
echo    npm install
echo 4. Seed database (optional):
echo    npm run seed
echo 5. Start server:
echo    npm run dev
echo.
echo Server will run on: http://localhost:5000
echo API endpoints: http://localhost:5000/api
echo.
echo ========================================
echo FRONTEND SETUP:
echo 1. Navigate to frontend folder:
echo    cd d:\odoo_hackathaon\frontend
echo 2. Install dependencies:
echo    npm install
echo 3. Start React app:
echo    npm start
echo.
echo App will run on: http://localhost:3000
echo.
echo ========================================
echo VANILLA FRONTEND:
echo Open frontend/vanilla/index.html in browser
echo No server required - pure HTML/CSS/JS
echo.
echo ========================================
echo LOGIN CREDENTIALS:
echo Email: admin@gearguard.com
echo Password: password123
echo.
echo ========================================
echo.
pause
