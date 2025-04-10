from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.schemas import VisitCreate, Visit
from app.db.database import get_db
from app.services.analytics_service import (
    create_or_update_visit_service,
    get_current_metrics_service,
    get_visit_by_url_service,
    get_all_visits_service,
)

analytics_router = APIRouter()

@analytics_router.post("/", response_model=Visit)
async def create_or_update_visit_endpoint(visit: VisitCreate, db: AsyncSession = Depends(get_db)):
    try:
        result = await create_or_update_visit_service(db, visit)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@analytics_router.get("/current", response_model=Visit)
async def get_current_metrics_endpoint(db: AsyncSession = Depends(get_db)):
    try:
        result = await get_current_metrics_service(db)
        if not result:
            raise HTTPException(status_code=404, detail="No current metrics available.")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@analytics_router.get("/url/{url}", response_model=Visit)
async def get_visit_by_url_endpoint(url: str, db: AsyncSession = Depends(get_db)):
    try:
        result = await get_visit_by_url_service(db, url)
        if not result:
            raise HTTPException(status_code=404, detail=f"No visit found for URL: {url}")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@analytics_router.get("/history", response_model=list[Visit])
async def get_all_visits_endpoint(db: AsyncSession = Depends(get_db)):
    try:
        result = await get_all_visits_service(db)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")
