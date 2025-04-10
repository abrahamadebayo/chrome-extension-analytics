import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from app.db.database import get_db_url
from app.core.models import Base

async def init_db():
    """Initialize the database with tables."""
    from app.core import models  # Import models to ensure they're registered with Base

    db_url = get_db_url()
    engine = create_async_engine(db_url)
    
    async with engine.begin() as conn:
        # Create all tables
        await conn.run_sync(Base.metadata.create_all)
    
    await engine.dispose()
    
    print("Database tables created successfully")

def main():
    """Entry point for running database initialization directly."""
    asyncio.run(init_db())

if __name__ == "__main__":
    main()
