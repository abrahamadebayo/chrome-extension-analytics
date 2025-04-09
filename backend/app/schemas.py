from pydantic import BaseModel
from datetime import datetime
from typing import List

class VisitBase(BaseModel):
    url: str
    link_count: int
    word_count: int
    image_count: int

class VisitCreate(VisitBase):
    pass

class Visit(VisitBase):
    datetime_visited: datetime
    total_visits: int

    class Config:
        orm_mode = True

class PageVisitHistoryResponse(BaseModel):
    visits: List[Visit]
