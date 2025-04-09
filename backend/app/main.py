from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import analytics
from app.models import Base
from app.database import engine
import asyncio
from sqlalchemy.exc import OperationalError

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Asynchronous table creation with retries
async def create_tables():
    retries = 5
    for i in range(retries):
        try:
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
                break
        except OperationalError:
            if i < retries - 1:
                await asyncio.sleep(5)
            else:
                raise

@app.on_event("startup")
async def on_startup():
    await create_tables()

# Include the analytics router with a prefix
app.include_router(analytics.analytics_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Chrome Extension Analytics API!"}
