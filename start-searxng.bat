@echo off
setlocal
cd /d "%~dp0docker\searxng"

echo Starting SearXNG on http://127.0.0.1:8888 ...
docker compose up -d
if errorlevel 1 (
  echo Failed to start SearXNG. Is Docker running?
  exit /b 1
)

echo.
echo SearXNG is starting. Wait a few seconds, then test:
echo   curl "http://127.0.0.1:8888/search?q=test&format=json"
echo.
echo Stop: cd docker\searxng ^&^& docker compose down
endlocal
