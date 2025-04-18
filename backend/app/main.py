import logging
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
import traceback

from app.routers.analytics import analytics_router
# Import models to ensure they're loaded
from app.core import models

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Chrome Extension Analytics API",
    description="API for tracking and analyzing web page visits",
    version="1.0.0",
    debug=True  # Enable debug mode for development
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Include the analytics router with a prefix
app.include_router(analytics_router, prefix="/api/analytics")

# Add a direct test DELETE endpoint to main.py for debugging
@app.delete("/api/test-delete", status_code=status.HTTP_200_OK)
async def test_delete():
    """
    Test DELETE endpoint directly on the main app
    """
    logger.info("Test DELETE endpoint called")
    return {"status": "success", "message": "DELETE method working"}

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Handle validation errors (422 Unprocessable Entity)
    """
    logger.error(f"Validation error: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors(), "body": exc.body},
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """
    Handle all other unexpected errors
    """
    logger.error(f"Unexpected error: {str(exc)}")
    logger.error(traceback.format_exc())
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": f"Internal server error: {str(exc)}"},
    )

@app.get("/")
def read_root():
    return {"message": "Welcome to the Chrome Extension Analytics API!"}

@app.get("/health")
def health_check():
    """
    Health check endpoint for monitoring
    """
    return {"status": "healthy"}
