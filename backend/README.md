# Chrome Extension Analytics - Backend Setup

This document provides instructions for setting up and running the backend of the Chrome Extension Analytics project, which utilizes FastAPI and PostgreSQL.

## Project Structure

The backend is structured as follows:

```
backend/
├── app/
│   ├── api/
│   │   ├── v1/
│   │   │   ├── endpoints/
│   │   │   │   └── analytics.py # REST API endpoints for analytics
│   │   │   └── __init__.py
│   │   └── __init__.py
│   ├── database.py      # Database connection and session management
│   ├── main.py          # Entry point for the FastAPI application
│   ├── models.py        # Database models using SQLAlchemy
│   ├── schemas.py       # Pydantic schemas for request/response validation
│   └── __init__.py
├── Dockerfile            # Dockerfile for building the FastAPI backend image
├── requirements.txt      # Python dependencies for the FastAPI application
└── README.md             # Documentation for the backend setup
```

## Prerequisites

- **Docker and Docker Compose**: Ensure both are installed on your machine.
- **PostgreSQL Database**: The backend requires a PostgreSQL database, which can be set up via Docker Compose.

## Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd chrome-extension-analytics/backend
   ```

2. **Build the Docker image (optional):**

   If you want to build the backend Docker image manually, run:

   ```bash
   docker build -t chrome-extension-analytics-backend .
   ```

3. **Run the application with Docker Compose:**

   From the root directory of the project (where `docker-compose.yml` is located), run:

   ```bash
   docker-compose up
   ```

   This command will start both the FastAPI backend and the PostgreSQL database.

4. **Access the API:**

   Once the services are running, you can access the FastAPI application at:

   - **Base URL**: `http://localhost:8000`
   - **API Documentation**: `http://localhost:8000/docs`

## API Endpoints

- **POST /api/v1/analytics**: Store page visit data.
- **GET /api/v1/analytics/{url}**: Fetch visit history for a given URL.
- **GET /api/v1/analytics/current**: Fetch metrics for the current page.

## Database Configuration

The database connection settings are configured in the `database.py` file. By default, the settings are:

- **Host**: `db` (Docker Compose service name)
- **Port**: `5432`
- **User**: `postgres`
- **Password**: `mysecretpassword`
- **Database**: `mydatabase`

Ensure that the PostgreSQL service is running and accessible.

## Notes

- **Local Development**: This backend is designed for local development and does not include authentication or user accounts.
- **Dependencies**: All Python dependencies are listed in `requirements.txt` and are installed in the Docker container during the build process.
- **Health Check**: The PostgreSQL service includes a health check to ensure it is ready before the backend starts.

## Troubleshooting

- **Database Connection Issues**: Ensure that the PostgreSQL service is running and the connection settings in `database.py` match the database configuration.
- **Docker Compose Errors**: If you encounter issues with Docker Compose, try rebuilding the containers:

   ```bash
   docker-compose down -v
   docker-compose up --build
   ```

- **Accessing Logs**: Use the following command to view logs for the backend service:

   ```bash
   docker-compose logs backend
   ```