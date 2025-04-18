from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import logging
from pydantic import ValidationError

from app.db.database import get_db
from app.core.schemas import VisitCreate, Visit
from app.services.analytics_service import (
    create_or_update_visit_service,
    get_current_metrics_service,
    get_visit_by_url_service,
    get_all_visits_service
)

# Configure logging
logger = logging.getLogger(__name__)

analytics_router = APIRouter()

@analytics_router.post("/", response_model=Visit, status_code=status.HTTP_200_OK)
async def create_or_update_visit(visit_data: VisitCreate, db: AsyncSession = Depends(get_db)):
    """
    Create a new page visit record or update an existing one.
    """
    try:
        result = await create_or_update_visit_service(db, visit_data)
        return result
    except ValidationError as e:
        # Handle validation errors
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Validation error: {str(e)}"
        )
    except Exception as e:
        # Log the exception for debugging
        logger.exception(f"Error creating/updating visit: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process visit data: {str(e)}"
        )

@analytics_router.get("/current", response_model=Optional[Visit], status_code=status.HTTP_200_OK)
async def get_current_metrics(db: AsyncSession = Depends(get_db)):
    """
    Get metrics for the most recently visited page.
    """
    try:
        result = await get_current_metrics_service(db)
        # If no visit exists, return null but with 200 OK status
        return result
    except Exception as e:
        logger.exception(f"Error retrieving current metrics: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get current metrics: {str(e)}"
        )

@analytics_router.get("/url/{url:path}", response_model=Optional[Visit], status_code=status.HTTP_200_OK)
async def get_visit_by_url(url: str, db: AsyncSession = Depends(get_db)):
    """
    Get metrics for a specific URL.
    """
    try:
        result = await get_visit_by_url_service(db, url)
        if not result:
            # Return null with 404 status if URL not found
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No visit data found for URL: {url}"
            )
        return result
    except HTTPException:
        # Re-raise HTTP exceptions to preserve their status codes
        raise
    except Exception as e:
        logger.exception(f"Error retrieving visit by URL: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get metrics for URL: {str(e)}"
        )

@analytics_router.get("/history", response_model=List[Visit], status_code=status.HTTP_200_OK)
async def get_visit_history(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    """
    Get historical visit data with pagination.
    """
    try:
        return await get_all_visits_service(db, skip, limit)
    except Exception as e:
        logger.exception(f"Error retrieving visit history: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get visit history: {str(e)}"
        )
