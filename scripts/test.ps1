# scripts/test.ps1 - Run backend and frontend tests
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Running Backend (Django) Test Suite..." -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

Push-Location backend
..\.venv\Scripts\python manage.py test
$backendResult = $LASTEXITCODE
Pop-Location

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "Running Frontend (Vite / TypeScript) Build Test..." -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

Push-Location frontend
npm run build
$frontendResult = $LASTEXITCODE
Pop-Location

if ($backendResult -eq 0 -and $frontendResult -eq 0) {
    Write-Host "`nAll Backend and Frontend verification tests passed successfully!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "`nOne or more test suites failed." -ForegroundColor Red
    exit 1
}
