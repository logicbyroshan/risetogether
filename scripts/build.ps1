# scripts/build.ps1 - Production build script
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Building RiseTogether Production Assets" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Build Frontend
Write-Host "1. Building React / Vite frontend..." -ForegroundColor Yellow
Push-Location frontend
npm run build
Pop-Location

# 2. Collect Django Static Files
Write-Host "2. Collecting Django static files..." -ForegroundColor Yellow
Push-Location backend
..\.venv\Scripts\python manage.py collectstatic --noinput
Pop-Location

Write-Host "`nBuild complete!" -ForegroundColor Green
