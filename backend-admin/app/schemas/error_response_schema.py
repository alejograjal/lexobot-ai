from pydantic import BaseModel
from typing import Any, List, Optional, Union

class ValidationErrorDetail(BaseModel):
    type: str
    loc: List[Union[str, int]]
    msg: str
    input: Optional[Any] = None
    ctx: Optional[dict] = None

class ErrorObject(BaseModel):
    code: str
    message: str
    status: int
    path: Optional[str] = None
    details: Optional[List[ValidationErrorDetail]] = None


class ErrorResponse(BaseModel):
    error: ErrorObject
    
common_errors = {
    401: {"model": ErrorResponse, "description": "Unauthorized"},
    403: {"model": ErrorResponse, "description": "Forbidden"},
    500: {"model": ErrorResponse, "description": "Internal server error"},
}

not_found_error = {404: {"model": ErrorResponse, "description": "Resource not found"}}
validation_error = {422: {"model": ErrorResponse, "description": "Validation error"}}
duplicate_entry_error = {400: {"model": ErrorResponse, "description": "Duplicate entry"}}