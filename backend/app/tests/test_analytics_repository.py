import pytest
import pytest_asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.database import Base
from app.core.schemas import VisitCreate
from app.repositories.analytics_repository import (
    create_or_update_visit_repository,
    get_current_metrics_repository,
    get_visit_by_url_repository,
    get_all_visits_repository,
)

# Use an in-memory SQLite database that persists across connections.
DATABASE_URL = "sqlite+aiosqlite:///:memory:"

engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

@pytest_asyncio.fixture(scope="function")
async def session():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with TestingSessionLocal() as session:
        yield session
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.mark.asyncio
async def test_create_or_update_visit(session: AsyncSession):
    # Create initial visit record.
    visit_data = VisitCreate(
        url="http://example.com",
        link_count=5,
        word_count=100,
        image_count=3
    )
    visit = await create_or_update_visit_repository(session, visit_data)
    assert visit.url == "http://example.com"
    assert visit.total_visits == 1

    # Call again with the same URL to update the record.
    updated_visit = await create_or_update_visit_repository(session, visit_data)
    assert updated_visit.url == "http://example.com"
    assert updated_visit.total_visits == 2
    assert updated_visit.link_count == 5

@pytest.mark.asyncio
async def test_get_current_metrics(session: AsyncSession):
    # Initially, no visit exists so current metrics should be None.
    current = await get_current_metrics_repository(session)
    assert current is None

    # Create a visit record and then check current metrics.
    visit_data = VisitCreate(
        url="http://example.com",
        link_count=10,
        word_count=200,
        image_count=4
    )
    await create_or_update_visit_repository(session, visit_data)
    current = await get_current_metrics_repository(session)
    assert current is not None
    assert current.url == "http://example.com"

@pytest.mark.asyncio
async def test_get_visit_by_url(session: AsyncSession):
    # Create a visit for a specific URL.
    visit_data = VisitCreate(
        url="http://example.com/test",
        link_count=3,
        word_count=50,
        image_count=1
    )
    await create_or_update_visit_repository(session, visit_data)
    
    visit = await get_visit_by_url_repository(session, "http://example.com/test")
    assert visit is not None
    assert visit.url == "http://example.com/test"
    assert visit.link_count == 3

@pytest.mark.asyncio
async def test_get_all_visits(session: AsyncSession):
    # Create several visit records.
    urls = [
        "http://example.com/1",
        "http://example.com/2",
        "http://example.com/3"
    ]
    for url in urls:
        visit_data = VisitCreate(
            url=url,
            link_count=2,
            word_count=75,
            image_count=1
        )
        await create_or_update_visit_repository(session, visit_data)

    visits = await get_all_visits_repository(session)
    # Assuming each URL is unique, we should get one entry per URL.
    assert len(visits) == len(urls)
    returned_urls = {visit.url for visit in visits}
    assert set(urls) == returned_urls
