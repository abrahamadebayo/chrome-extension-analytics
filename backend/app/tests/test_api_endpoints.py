import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app

# The async_client fixture is provided by conftest.py.
# We assume conftest.py has overridden the get_db dependency appropriately.

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
    assert current_data["url"] == "http://example.com/test"

@pytest.mark.asyncio
async def test_get_by_url_and_history(async_client: AsyncClient):
    # Create first visit record
    payload1 = {
       "url": "http://example.com/test",
       "link_count": 10,
       "word_count": 200,
       "image_count": 5
    }
    response_1 = await async_client.post("/api/", json=payload1)
    assert response_1.status_code == 200
    
    # Create second visit record for a different URL
    payload2 = {
       "url": "http://example.com/test2",
       "link_count": 5,
       "word_count": 150,
       "image_count": 2
    }
    response_2 = await async_client.post("/api/", json=payload2)
    assert response_2.status_code == 200

    # Test GET endpoint for a specific URL
    response_by_url = await async_client.get("/api/url/http://example.com/test2")
    assert response_by_url.status_code == 200
    url_data = response_by_url.json()
    assert url_data["url"] == "http://example.com/test2"

    # Test GET /history endpoint
    response_history = await async_client.get("/api/history")
    assert response_history.status_code == 200
    history_data = response_history.json()
    # Expect two unique records: one for "/test" and one for "/test2"
    assert len(history_data) == 2
    urls = {visit["url"] for visit in history_data}
    assert urls == {"http://example.com/test", "http://example.com/test2"}
