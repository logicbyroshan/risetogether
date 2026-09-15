#!/usr/bin/env bash
# scripts/dev.sh - Start both Backend (Django) and Frontend (Vite)
set -e

echo "Starting RiseTogether Development Servers..."

# Trap for cleanup on exit
trap 'kill 0' SIGINT SIGTERM EXIT

(cd backend && ../.venv/bin/python manage.py runserver 127.0.0.1:8000) &
(cd frontend && npm run dev) &

wait
