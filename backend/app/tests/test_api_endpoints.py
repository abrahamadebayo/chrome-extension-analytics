import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from app.core.database import Base, get_db
from app.main import app

# Use an in-memory SQLite database for testing.
DATABASE_URL = "sqlite+aiosqlite:///:memory:"

# Create an async engine and session maker for tests.
engine = create_async_engine(DATABASE_URL, echo=False)
TestingSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

# Override the get_db dependency to use the test database.
async def override_get_db():
    async with TestingSessionLocal() as session:
        yield session

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="module")
async def async_client():
    # Create the test database schema.
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client
    # Drop the test database schema after tests.
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.mark.asyncio
async def test_create_or_update_and_get_current(async_client: AsyncClient):
    # Test POST endpoint to create a visit.
    payload = {
       "url": "http://example.com/test",
       "link_count": 10,
       "word_count": 200,
       "image_count": 5
    }
    response = await async_client.post("/api/", json=payload)
    assert response.status_code == 200, f"Unexpected status: {response.status_code}"
    data = response.json()
    assert data["url"] == "http://example.com/test"
    assert data["total_visits"] == 1

    # Call POST again to update the same URL.
    response_update = await async_client.post("/api/", json=payload)
    assert response_update.status_code == 200
    updated_data = response_update.json()
    assert updated_data["total_visits"] == 2

    # Test GET /current endpoint.
    response_current = await async_client.get("/api/current")
    assert response_current.status_code == 200
    current_data = response_current.json()
    # The latest record should be from the updated URL.
    assert current_data["url"] == "http://example.com/test"

@pytest.mark.asyncio
async def test_get_by_url_and_history(async_client: AsyncClient):
    # Create another visit record for a different URL.
    payload2 = {
       "url": "http://example.com/test2",
       "link_count": 5,
       "word_count": 150,
       "image_count": 2
    }
    response_2 = await async_client.post("/api/", json=payload2)
    assert response_2.status_code == 200

    # Test GET endpoint for a specific URL.
    response_by_url = await async_client.get("/api/url/http://example.com/test2")
    assert response_by_url.status_code == 200
    url_data = response_by_url.json()
    assert url_data["url"] == "http://example.com/test2"

    # Test GET /history endpoint.
    response_history = await async_client.get("/api/history")
    assert response_history.status_code == 200
    history_data = response_history.json()
    # We expect two unique records now.
    assert len(history_data) == 2
    urls = {visit["url"] for visit in history_data}
    assert urls == {"http://example.com/test", "http://example.com/test2"}
