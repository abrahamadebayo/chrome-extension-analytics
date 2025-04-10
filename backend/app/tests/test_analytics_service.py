import pytest
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from app.core.database import Base
from app.core.schemas import VisitCreate
from app.services.analytics_service import (
    create_or_update_visit_service,
    get_current_metrics_service,
    get_visit_by_url_service,
    get_all_visits_service,
)

# Use an in-memory SQLite database for testing.
DATABASE_URL = "sqlite+aiosqlite:///:memory:"

# Create an async engine and session maker for testing.
engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

@pytest.fixture
async def session():
    # Create tables before each test.
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with AsyncSessionLocal() as session:
        yield session
    # Drop tables after the test.
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.mark.asyncio
async def test_service_create_or_update_visit(session: AsyncSession):
    # Create initial visit record.
    visit_data = VisitCreate(
        url="http://example.com/service",
        link_count=7,
        word_count=150,
        image_count=5,
    )
    visit = await create_or_update_visit_service(session, visit_data)
    assert visit.url == "http://example.com/service"
    assert visit.total_visits == 1

    # Call again with the same URL to update the record.
    updated_visit = await create_or_update_visit_service(session, visit_data)
    assert updated_visit.url == "http://example.com/service"
    assert updated_visit.total_visits == 2
    assert updated_visit.link_count == 7

@pytest.mark.asyncio
async def test_service_get_current_metrics(session: AsyncSession):
    # Initially, no record exists so current metrics should be None.
    current = await get_current_metrics_service(session)
    assert current is None

    # Create a visit record.
    visit_data = VisitCreate(
        url="http://example.com/service_current",
        link_count=4,
        word_count=120,
        image_count=2,
    )
    await create_or_update_visit_service(session, visit_data)
    current = await get_current_metrics_service(session)
    assert current is not None
    assert current.url == "http://example.com/service_current"

@pytest.mark.asyncio
async def test_service_get_visit_by_url(session: AsyncSession):
    # Create a visit for a specific URL.
    visit_data = VisitCreate(
        url="http://example.com/service_detail",
        link_count=3,
        word_count=80,
        image_count=1,
    )
    await create_or_update_visit_service(session, visit_data)
    
    visit = await get_visit_by_url_service(session, "http://example.com/service_detail")
    assert visit is not None
    assert visit.url == "http://example.com/service_detail"
    assert visit.link_count == 3

@pytest.mark.asyncio
async def test_service_get_all_visits(session: AsyncSession):
    # Create several visit records with unique URLs.
    urls = [
        "http://example.com/service/1",
        "http://example.com/service/2",
        "http://example.com/service/3"
    ]
    for url in urls:
        visit_data = VisitCreate(
            url=url,
            link_count=5,
            word_count=100,
            image_count=2,
        )
        await create_or_update_visit_service(session, visit_data)

    visits = await get_all_visits_service(session)
    # Assuming each URL is unique, there should be one entry per URL.
    assert len(visits) == len(urls)
    returned_urls = {visit.url for visit in visits}
    assert set(urls) == returned_urls
