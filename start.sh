#!/bin/bash
set -e

cd backend
exec /opt/venv/bin/daphne -b 0.0.0.0 -p "${PORT}" core.asgi:application
