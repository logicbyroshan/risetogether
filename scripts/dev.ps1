# scripts/dev.ps1 - Start both Backend (Django) and Frontend (Vite)
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Starting RiseTogether Development Servers" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Start Backend Server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; ..\.venv\Scripts\python manage.py runserver 127.0.0.1:8000"

# Start Frontend Dev Server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "Backend running at:  http://127.0.0.1:8000" -ForegroundColor Green
Write-Host "Django Admin at:     http://127.0.0.1:8000/admin/" -ForegroundColor Green
Write-Host "Frontend running at: http://localhost:5173" -ForegroundColor Green
