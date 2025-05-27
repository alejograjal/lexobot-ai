"""
Question Answering service module initialization.
Provides centralized access to QA functionality including:
- Question answering engine
- Response caching
- Conversation memory
- Vector store operations
- LLM chain handling
"""

from .engine import ask_question
from .llm_chain import run_llm_chain
from .memory_handler import get_memory
from .vectorstore import retrieve_relevant_docs
from .cache_handler import get_similar_answer_or_none, store_answer_if_needed

__all__ = [
    # Main QA Engine
    "ask_question",
    
    # Cache Operations
    "get_similar_answer_or_none",
    "store_answer_if_needed",
    
    # Document Retrieval
    "retrieve_relevant_docs",
    
    # Memory Management
    "get_memory",
    
    # LLM Chain
    "run_llm_chain"
]