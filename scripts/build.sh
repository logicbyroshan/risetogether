#!/usr/bin/env bash
# scripts/build.sh - Build production frontend and collect static files
set -e

echo "Building React Frontend..."
(cd frontend && npm run build)

echo "Collecting Django Static Files..."
(cd backend && ../.venv/bin/python manage.py collectstatic --noinput)

echo "Production build completed successfully!"
