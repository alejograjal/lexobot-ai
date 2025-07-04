from typing import List
from pydantic import BaseModel

class DailyCount(BaseModel):
    date: str
    count: int

class QuestionCount(BaseModel):
    question: str
    count: int

class QuestionMetricsResponse(BaseModel):
    total: int
    by_day: List[DailyCount]
    top_questions: List[QuestionCount]