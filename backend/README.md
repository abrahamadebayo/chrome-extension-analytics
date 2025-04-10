# Chrome Extension Analytics - Backend Setup

This document provides instructions for setting up and running the backend of the Chrome Extension Analytics project, which utilizes FastAPI and PostgreSQL.

## Project Structure

The backend is structured as follows:

```
backend/
├── app/
│   ├── core/
│   │   ├── models.py      # Database models using SQLAlchemy
│   │   ├── schemas.py     # Pydantic schemas for request/response validation
│   │   └── __init__.py
│   ├── db/
│   │   ├── database.py    # Database connection and session management
│   │   ├── init_db.py     # Database initialization script
│   │   └── __init__.py
│   ├── repositories/      # Data access layer
│   │   ├── analytics_repository.py
│   │   └── __init__.py
│   ├── routers/           # API route definitions
│   │   ├── analytics.py   # Analytics endpoints
│   │   └── __init__.py
│   ├── services/          # Business logic layer
│   │   ├── analytics_service.py
│   │   └── __init__.py
│   ├── tests/             # Test suite
│   │   ├── conftest.py    # Test configuration and fixtures
│   │   ├── test_analytics_repository.py
│   │   ├── test_analytics_service.py
│   │   └── test_api_endpoints.py
│   ├── main.py            # Entry point for the FastAPI application
│   └── __init__.py
├── scripts/
│   └── entrypoint.sh      # Container entrypoint script
├── .env                   # Environment variables for development
├── .env-sample            # Sample environment variables
├── Dockerfile             # Dockerfile for building the FastAPI backend image
├── requirements.txt       # Python dependencies
└── README.md              # Documentation
```

## Prerequisites

- **Docker and Docker Compose**: Ensure both are installed on your machine.
- **PostgreSQL Database**: The backend requires a PostgreSQL database, which can be set up via Docker Compose.
- **Python 3.9+**: For local development outside of Docker.

## Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd chrome-extension-analytics/backend
   ```

2. **Set up environment variables:**

   Copy the sample environment file and adjust as needed:

   ```bash
   cp .env-sample .env
   ```

3. **Build the Docker image (optional):**

   If you want to build the backend Docker image manually, run:

   ```bash
   docker build -t chrome-extension-analytics-backend .
   ```

4. **Run the application with Docker Compose:**

   From the root directory of the project (where `docker-compose.yml` is located), run:

   ```bash
   docker-compose up
   ```

   This command will start both the FastAPI backend and the PostgreSQL database.

5. **Access the API:**

   Once the services are running, you can access the FastAPI application at:

   - **Base URL**: `http://localhost:8000`
   - **API Documentation**: `http://localhost:8000/docs`

## Running Tests

To run the tests, you need to set up a local Python environment:

1. **Create and activate a virtual environment:**

   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows, use: .venv\Scripts\activate
   ```

2. **Install the required dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

3. **Set PYTHONPATH to include the current directory:**

   ```bash
   export PYTHONPATH=$(pwd)  # On Windows PowerShell, use: $env:PYTHONPATH = $(pwd)
   ```

4. **Run the tests:**

   ```bash
   # Run all tests
   pytest

   # Run with verbose output
   pytest -v

   # Run with verbose output and suppress warnings
   pytest -v --disable-warnings

   # Run a specific test file
   pytest app/tests/test_api_endpoints.py
   ```

   The tests use an in-memory SQLite database, so no external database is required.

## API Endpoints

- **POST /api/analytics/**: Store page visit data.
- **GET /api/analytics/current**: Fetch metrics for the most recently visited page.
- **GET /api/analytics/url/{url}**: Fetch visit history for a given URL.
- **GET /api/analytics/history**: Fetch all visit history with pagination.

## Database Configuration

The database connection settings are configured through environment variables in the `.env` file. The default settings are:

- **Host**: `db` (Docker Compose service name)
- **Port**: `5432`
- **User**: `postgres`
- **Password**: `mysecretpassword`
- **Database**: `mydatabase`

Ensure that the PostgreSQL service is running and accessible.

## Development Notes

- **Local Development**: This backend is designed for local development and does not include authentication or user accounts.
- **Dependencies**: All Python dependencies are listed in `requirements.txt` and are installed in the Docker container during the build process.
- **Health Check**: The PostgreSQL service includes a health check to ensure it is ready before the backend starts.
- **Module Imports**: If you encounter import errors when running Python scripts directly, set the PYTHONPATH:
  ```bash
  export PYTHONPATH=$(pwd)  # On Windows PowerShell, use: $env:PYTHONPATH = $(pwd)
  ```

## Troubleshooting

- **Database Connection Issues**: Ensure that the PostgreSQL service is running and the connection settings in your `.env` file match the database configuration.

- **Docker Compose Errors**: If you encounter issues with Docker Compose, try rebuilding the containers:

   ```bash
   docker-compose down -v
   docker-compose up --build
   ```

- **Disk Space Issues**: If you encounter "No space left on device" errors:

   ```bash
   # Check Docker disk usage
   docker system df
   
   # Clean up unused Docker resources
   docker system prune -a --volumes
   ```

- **Module Import Errors**: If Python cannot find modules, ensure PYTHONPATH is set correctly:

   ```bash
   export PYTHONPATH=$(pwd)
   ```

- **Accessing Logs**: Use the following command to view logs for the backend service:

   ```bash
   docker-compose logs backend
   ```

- **Test Failures**: If tests are failing, check if all dependencies are installed and the database models are correctly defined:

   ```bash
   # Verify SQLAlchemy models
   python -c "from app.core.models import Base; print(Base.metadata.tables.keys())"
   ```

- **404 Not Found Errors**: If your API requests return 404 errors, check that you're using the correct URL paths:
   ```bash
   # Correct endpoint format examples
   curl -X POST http://localhost:8000/api/analytics/ -d '{"url":"http://example.com","link_count":5,"word_count":100,"image_count":3}'
   curl -X GET http://localhost:8000/api/analytics/current
   curl -X GET http://localhost:8000/api/analytics/history
   ```

- **CORS Issues**: If frontend requests are failing due to CORS, check that your frontend origin is included in the CORS configuration in `main.py`.