import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.core.models import Base

def get_db_url():
    """Get database URL from environment or use SQLite as fallback."""
    return os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:mysecretpassword@db:5432/mydatabase")

# Create engine and session factory
engine = create_async_engine(get_db_url())
AsyncSessionLocal = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

async def get_db() -> AsyncSession:
    """Dependency for getting an async database session."""
    async with AsyncSessionLocal() as session:
        yield session

def override_get_db(db_session: AsyncSession):
    """Override for testing purposes."""
    async def _get_db():
        yield db_session
    return _get_db
