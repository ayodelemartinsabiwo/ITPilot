#!/bin/bash
set -e

cd backend
exec /app/venv/bin/daphne -b 0.0.0.0 -p "${PORT}" core.asgi:application
