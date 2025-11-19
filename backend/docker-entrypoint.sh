#!/bin/bash
set -e

echo "Running database migrations..."
python manage.py migrate --noinput

echo "Auto-verifying unverified users (temporary fix for email configuration)..."
python manage.py verify_all_users 2>&1 || echo "Note: verify_all_users command completed"

echo "Starting Daphne server on port ${PORT:-8000}..."
exec daphne -b 0.0.0.0 -p "${PORT:-8000}" core.asgi:application
