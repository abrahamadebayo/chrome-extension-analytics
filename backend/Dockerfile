FROM python:3.9-slim as builder

WORKDIR /app

# Copy requirements and install dependencies in a separate layer
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Start from a clean slim image
FROM python:3.9-slim

WORKDIR /app

# Copy only the installed packages from the builder stage
COPY --from=builder /usr/local/lib/python3.9/site-packages /usr/local/lib/python3.9/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Set Python-specific environment variables
# These are better kept in the Dockerfile as they're related to the runtime, not the application config
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Copy the application code and .env file
COPY ./app ./app
COPY ./.env ./.env

# Create and copy the entrypoint script
COPY ./scripts/entrypoint.sh .
RUN chmod +x entrypoint.sh

# Clean up unnecessary files to reduce image size
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Health check to ensure disk space
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD df -h | grep -vE '^tmpfs|^/dev/loop|^/dev/disk' || exit 1

# Set the entrypoint script as the command to run
ENTRYPOINT ["./entrypoint.sh"]