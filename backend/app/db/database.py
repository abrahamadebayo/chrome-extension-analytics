import os
import logging
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from app.core.models import Base

# Load environment variables from .env file
load_dotenv()

# Configure logging
logger = logging.getLogger(__name__)

def get_db_url():
    """Get database URL from environment or use SQLite as fallback."""
    db_url = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./test.db")
    logger.info(f"Using database URL: {db_url}")
    return db_url

# Create engine and session factory
try:
    engine = create_async_engine(
        get_db_url(),
        echo=False,  # Set to True to log SQL
        future=True
    )
    AsyncSessionLocal = sessionmaker(
        engine, 
        class_=AsyncSession, 
        expire_on_commit=False,
        autoflush=False
    )
    logger.info("Database engine and session factory created successfully")
except Exception as e:
    logger.error(f"Error creating database engine: {str(e)}")
    raise

async def get_db() -> AsyncSession:
    """Dependency for getting an async database session."""
    session = AsyncSessionLocal()
    try:
        yield session
    finally:
        await session.close()
