from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models import PageVisit
from app.schemas import VisitCreate, Visit
from app.database import get_db
from datetime import datetime

analytics_router = APIRouter()

@analytics_router.post("/", response_model=Visit)
async def create_or_update_visit(visit: VisitCreate, db: AsyncSession = Depends(get_db)):
    try:
        # Check if a record for the given URL already exists.
        stmt = select(PageVisit).where(PageVisit.url == visit.url)
        result = await db.execute(stmt)
        existing_visit = result.scalars().first()

        if existing_visit:
            # Increment total_visits and update other metrics.
            existing_visit.total_visits += 1
            existing_visit.datetime_visited = datetime.utcnow()
            existing_visit.link_count = visit.link_count
            existing_visit.word_count = visit.word_count
            existing_visit.image_count = visit.image_count
            await db.commit()
            await db.refresh(existing_visit)
            return existing_visit
        else:
            # Create a new record with total_visits set to 1.
            new_visit = PageVisit(
                url=visit.url,
                datetime_visited=datetime.utcnow(),
                link_count=visit.link_count,
                word_count=visit.word_count,
                image_count=visit.image_count,
                total_visits=1
            )
            db.add(new_visit)
            await db.commit()
            await db.refresh(new_visit)
            return new_visit
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@analytics_router.get("/current", response_model=Visit)
async def get_current_metrics(db: AsyncSession = Depends(get_db)):
    try:
        # Query for the most recent update based on datetime_visited.
        stmt = select(PageVisit).order_by(PageVisit.datetime_visited.desc()).limit(1)
        result = await db.execute(stmt)
        current_visit = result.scalars().first()
        if not current_visit:
            raise HTTPException(status_code=404, detail="No current metrics available.")
        return current_visit
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@analytics_router.get("/url/{url}", response_model=Visit)
async def get_visit_detail(url: str, db: AsyncSession = Depends(get_db)):
    try:
        # Retrieve the record corresponding to the specified URL.
        stmt = select(PageVisit).where(PageVisit.url == url)
        result = await db.execute(stmt)
        visit = result.scalars().first()
        if not visit:
            raise HTTPException(status_code=404, detail=f"No visit found for URL: {url}")
        return visit
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@analytics_router.get("/history", response_model=list[Visit])
async def get_all_visits(db: AsyncSession = Depends(get_db)):
    try:
        # Retrieve all records from the database.
        stmt = select(PageVisit)
        result = await db.execute(stmt)
        visits = result.scalars().all()
        # Return an empty list if no visits are found.
        return visits if visits else []
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")
