FROM python:3.9

WORKDIR /app

# Copy requirements.txt and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Set environment variable
ENV DATABASE_URL=postgresql+asyncpg://postgres:mysecretpassword@db:5432/mydatabase

# Copy the application code
COPY ./app ./app

# Create and copy the entrypoint script
COPY ./scripts/entrypoint.sh .
RUN chmod +x entrypoint.sh

# Set the entrypoint script as the command to run
ENTRYPOINT ["./entrypoint.sh"]