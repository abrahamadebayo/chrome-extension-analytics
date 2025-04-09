from fastapi import APIRouter
from app.api.v1.endpoints import (
    analytics
)

api_router = APIRouter()
api_router.include_router(analytics.analytics_router, prefix="/api")