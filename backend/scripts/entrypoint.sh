#!/bin/bash
set -e

# Check disk space
echo "Checking disk space..."
df -h
FREE_SPACE=$(df / | grep / | awk '{print $4}')
MIN_SPACE_KB=512000  # Minimum 500MB free space

if [ "$FREE_SPACE" -lt "$MIN_SPACE_KB" ]; then
    echo "WARNING: Low disk space detected! Only ${FREE_SPACE}KB available."
    # Docker cleanup if running with appropriate privileges
    if command -v docker &> /dev/null; then
        echo "Attempting to clean up unused Docker resources..."
        docker system prune -f || echo "Docker cleanup failed - continuing anyway"
    fi
fi

# Run database migrations/initialization
echo "Running database migrations..."
python -m app.db.init_db

# Start the application
echo "Starting application..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
