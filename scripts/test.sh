#!/usr/bin/env bash
# scripts/test.sh - Run backend and frontend verification tests
set -e

echo "Running Backend Test Suite..."
(cd backend && ../.venv/bin/python manage.py test)

echo "Running Frontend Build Verification..."
(cd frontend && npm run build)

echo "All tests passed successfully!"
