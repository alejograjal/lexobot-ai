from typing import List
from pydantic import BaseModel

class QuestionCount(BaseModel):
    question: str
    count: int

class PeriodCount(BaseModel):
    date: str 
    count: int

class MetricsOverviewResponse(BaseModel):
    total: int
    top_questions: List[QuestionCount]
