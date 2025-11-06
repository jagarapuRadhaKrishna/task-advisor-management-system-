@echo off
REM MERN Task Manager - Quick Start Script

echo.
echo ╔════════════════════════════════════════════╗
echo ║  MERN TASK MANAGER - QUICK START          ║
echo ╚════════════════════════════════════════════╝
echo.

echo Killing any existing Node processes...
taskkill /F /IM node.exe /T 2>nul
timeout /t 2 /nobreak

echo.
echo Starting Backend Server (port 5000)...
start "Backend - npm run dev" cmd /k "cd backend && npm run dev"
timeout /t 5 /nobreak

echo.
echo Starting Frontend App (port 3000/3001)...
start "Frontend - npm start" cmd /k "cd frontend && npm start"
timeout /t 5 /nobreak

echo.
echo ════════════════════════════════════════════
echo ✅ Both servers should be running now
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000 (or 3001)
echo.
echo Test: Go to http://localhost:3000/register
echo ════════════════════════════════════════════
echo.
echo Press Enter to open application in browser...
pause

start http://localhost:3000
