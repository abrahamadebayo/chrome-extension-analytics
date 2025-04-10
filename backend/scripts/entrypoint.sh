#!/bin/bash
set -e

# Run database migrations/initialization
echo "Running database migrations..."
python -m app.db.init_db

# Start the application
echo "Starting application..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
