from typing import Dict, List
from pydantic import BaseModel

class QuestionCount(BaseModel):
    question: str
    count: int

class DailyCount(BaseModel):
    date: str
    count: int

class MetricsResponse(BaseModel):
    total: int
    by_day: List[DailyCount]
    top_questions: List[QuestionCount]