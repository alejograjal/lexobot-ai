"""
Utils module initialization.
Provides centralized access to utility functions including:
- File and filesystem operations
- Text similarity calculations
- Chat message handling
- PDF processing
"""

from .file import extract_text_from_pdf
from .filesystem import is_path_size_over_limit
from .chat import is_asking_for_sources, format_chat_history
from .similarity import are_questions_semantically_similar, SEMANTIC_SIMILARITY_THRESHOLD

__all__ = [
    # Filesystem Utils
    "is_path_size_over_limit",
    
    # Similarity Utils
    "are_questions_semantically_similar",
    "SEMANTIC_SIMILARITY_THRESHOLD",
    
    # Chat Utils
    "is_asking_for_sources",
    "format_chat_history",
    
    # File Processing Utils
    "extract_text_from_pdf"
]