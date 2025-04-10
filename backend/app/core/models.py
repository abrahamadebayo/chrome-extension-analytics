from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import declarative_base
from datetime import datetime

Base = declarative_base()

class PageVisit(Base):
    __tablename__ = 'page_visits'
    
    # Use URL as the primary key
    url = Column(String, primary_key=True, index=True)
    datetime_visited = Column(DateTime, default=datetime.utcnow, nullable=False)
    link_count = Column(Integer, nullable=False)
    word_count = Column(Integer, nullable=False)
    image_count = Column(Integer, nullable=False)
    total_visits = Column(Integer, default=0, nullable=False)
