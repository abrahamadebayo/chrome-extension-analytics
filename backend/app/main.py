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

# Print all registered routes for debugging
for route in app.routes:
    print(f"ROUTE: {route.path} [{','.join(route.methods)}]")

# Add a GET endpoint for deletion instead of DELETE
@app.get("/api/clear-history", status_code=status.HTTP_200_OK)
async def clear_history():
    """
    Alternative GET endpoint to handle history deletion
    """
    from app.services.analytics_service import delete_all_visits_service
    from app.db.database import AsyncSessionLocal
    
    logger.info("GET /api/clear-history endpoint called")
    
    # Get a database session
    async with AsyncSessionLocal() as session:
        try:
            await delete_all_visits_service(session)
            return {"status": "success", "message": "All visit records deleted successfully"}
        except Exception as e:
            logger.exception(f"Error clearing history: {str(e)}")
            return {"status": "error", "message": str(e)}

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
