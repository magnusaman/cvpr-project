@echo off
echo =========================================
echo ObjectVision AI - Startup Script
echo =========================================

echo Starting Flask API...
start "Flask API" cmd /k "cd api && python flask_app_yolo.py"

timeout /t 5 /nobreak

echo Starting React Frontend...
start "React Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo =========================================
echo Services Started!
echo =========================================
echo Backend API: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Close the command windows to stop services
echo =========================================
pause
