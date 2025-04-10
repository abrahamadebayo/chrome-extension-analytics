from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

from app.core.models import PageVisit
from app.core.schemas import VisitCreate

async def create_or_update_visit_repository(db: AsyncSession, visit_data: VisitCreate) -> PageVisit:
    """
    Look for an existing PageVisit record by URL. If found, updates the record by
    incrementing total_visits and refreshing its metrics; otherwise, creates a new record.
    """
    stmt = select(PageVisit).where(PageVisit.url == visit_data.url)
    result = await db.execute(stmt)
    existing_visit = result.scalars().first()

    if existing_visit:
        # Update the existing record.
        existing_visit.total_visits += 1
        existing_visit.datetime_visited = datetime.utcnow()  # Using utcnow directly
        existing_visit.link_count = visit_data.link_count
        existing_visit.word_count = visit_data.word_count
        existing_visit.image_count = visit_data.image_count

        await db.commit()
        await db.refresh(existing_visit)
        return existing_visit
    else:
        # Create a new record with total_visits set to 1.
        new_visit = PageVisit(
            url=visit_data.url,
            datetime_visited=datetime.utcnow(),  # Using utcnow directly
            link_count=visit_data.link_count,
            word_count=visit_data.word_count,
            image_count=visit_data.image_count,
            total_visits=1
        )
        db.add(new_visit)
        await db.commit()
        await db.refresh(new_visit)
        return new_visit

async def get_current_metrics_repository(db: AsyncSession) -> Optional[PageVisit]:
    """Get the most recent page visit record."""
    stmt = select(PageVisit).order_by(PageVisit.datetime_visited.desc()).limit(1)
    result = await db.execute(stmt)
    return result.scalars().first()

async def get_visit_by_url_repository(db: AsyncSession, url: str) -> Optional[PageVisit]:
    """Get a specific page visit record by URL."""
    stmt = select(PageVisit).where(PageVisit.url == url)
    result = await db.execute(stmt)
    return result.scalars().first()

async def get_all_visits_repository(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[PageVisit]:
    """Get all page visit records with pagination."""
    stmt = select(PageVisit).offset(skip).limit(limit)
    result = await db.execute(stmt)
    return result.scalars().all()
