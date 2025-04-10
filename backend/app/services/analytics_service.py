from sqlalchemy.ext.asyncio import AsyncSession
from app.core.schemas import VisitCreate, Visit
from app.repositories.analytics_repository import (
    create_or_update_visit_repository,
    get_current_metrics_repository,
    get_visit_by_url_repository,
    get_all_visits_repository,
)
from datetime import datetime

async def create_or_update_visit_service(db: AsyncSession, visit_data: VisitCreate) -> Visit:
    """
    Creates a new PageVisit record or updates an existing record for the given URL.
    This function delegates the database interaction to the repository layer.
    """
    # Additional business logic or validations can be added here.
    return await create_or_update_visit_repository(db, visit_data)

async def get_current_metrics_service(db: AsyncSession) -> Visit:
    """
    Retrieves the most recent PageVisit record based on the last update timestamp.
    """
    return await get_current_metrics_repository(db)

async def get_visit_by_url_service(db: AsyncSession, url: str) -> Visit:
    """
    Retrieves the PageVisit record that exactly matches the given URL.
    """
    return await get_visit_by_url_repository(db, url)

async def get_all_visits_service(db: AsyncSession) -> list[Visit]:
    """
    Retrieves all PageVisit records from the database.
    """
    return await get_all_visits_repository(db)
