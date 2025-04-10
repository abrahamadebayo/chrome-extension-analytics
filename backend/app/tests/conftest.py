import os
import sys
import pytest_asyncio
import asyncio
import pytest
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from app.db.database import get_db, override_get_db
from app.main import app
from app.core.models import Base, PageVisit

# Ensure the backend folder (parent of "app") is in sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.abspath(os.path.join(current_dir, ".."))
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

# In-memory SQLite database URL for tests
DATABASE_URL = "sqlite+aiosqlite:///:memory:"

# Create an async engine and TestingSessionLocal 
engine = create_async_engine(
    DATABASE_URL, 
    echo=False, 
    connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for each test case."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest_asyncio.fixture(scope="function")
async def session() -> AsyncSession:
    """Create a fresh database for each test function."""
    # Create all tables before each test
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async with TestingSessionLocal() as session:
        # Override the database dependency
        app.dependency_overrides[get_db] = lambda: override_get_db(session)
        yield session
    
    # Clean up - drop all tables after test
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest_asyncio.fixture
async def async_client(session) -> AsyncClient:
    """Get a test client for the FastAPI app."""
    # Use ASGITransport for newer versions of httpx
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client
