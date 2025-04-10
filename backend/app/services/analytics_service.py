from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, Dict, Any
import logging

from app.core.schemas import VisitCreate
from app.repositories.analytics_repository import (
    create_or_update_visit_repository,
    get_current_metrics_repository,
    get_visit_by_url_repository,
    get_all_visits_repository
)
from app.core.models import PageVisit

# Configure logging
logger = logging.getLogger(__name__)

async def create_or_update_visit_service(db: AsyncSession, visit_data: VisitCreate) -> PageVisit:
    """
    Service layer for creating or updating a page visit record.
    Includes validation and logging.
    """
    logger.info(f"Processing visit data for URL: {visit_data.url}")
    try:
        result = await create_or_update_visit_repository(db, visit_data)
        logger.info(f"Successfully processed visit data for URL: {visit_data.url}")
        return result
    except Exception as e:
        logger.error(f"Error in create_or_update_visit_service: {str(e)}")
        raise

async def get_current_metrics_service(db: AsyncSession) -> Optional[PageVisit]:
    """
    Service layer for getting metrics for the most recent page visit.
    """
    logger.info("Retrieving current metrics")
    try:
        return await get_current_metrics_repository(db)
    except Exception as e:
        logger.error(f"Error in get_current_metrics_service: {str(e)}")
        raise

async def get_visit_by_url_service(db: AsyncSession, url: str) -> Optional[PageVisit]:
    """
    Service layer for getting metrics for a specific URL.
    """
    logger.info(f"Retrieving visit data for URL: {url}")
    try:
        return await get_visit_by_url_repository(db, url)
    except Exception as e:
        logger.error(f"Error in get_visit_by_url_service: {str(e)}")
        raise

async def get_all_visits_service(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[PageVisit]:
    """
    Service layer for getting historical visit data with pagination.
    """
    logger.info(f"Retrieving all visits (skip={skip}, limit={limit})")
    try:
        return await get_all_visits_repository(db, skip, limit)
    except Exception as e:
        logger.error(f"Error in get_all_visits_service: {str(e)}")
        raise
