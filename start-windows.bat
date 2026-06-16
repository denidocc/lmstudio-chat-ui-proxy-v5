@echo off
title LM Studio Chat UI

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js не найден.
  echo Установите Node.js LTS: https://nodejs.org/
  pause
  exit /b 1
)

start http://localhost:8080

netstat -ano | findstr ":8080" | findstr "LISTENING" >nul 2>nul
if not errorlevel 1 (
  echo.
  echo Port 8080 is already in use.
  echo Close the other server window or run: set PORT=8081 ^&^& node server.js
  echo.
  pause
  exit /b 1
)

node server.js
pause
