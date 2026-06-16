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
node server.js
pause
