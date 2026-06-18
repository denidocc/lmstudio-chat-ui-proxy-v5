@echo off
setlocal
cd /d "%~dp0docker\firecrawl"

if not exist .env copy env.example .env

echo Starting Firecrawl on http://127.0.0.1:3002 ...
echo First run may pull large images and take several minutes.
echo.

docker compose up -d
if errorlevel 1 (
  echo Failed to start Firecrawl. Is Docker running?
  exit /b 1
)

echo.
echo Firecrawl is starting. Wait 1-2 minutes, then test scrape:
echo   curl -X POST http://127.0.0.1:3002/v2/scrape -H "Content-Type: application/json" -d "{\"url\":\"https://example.com\",\"formats\":[\"markdown\"]}"
echo.
echo Stop: cd docker\firecrawl ^&^& docker compose down
endlocal
