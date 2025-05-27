"""
Cache module initialization.
Provides access to caching functionality for embeddings and other cached data.
"""

from .embedding_cache import get_or_embed, normalize_question

__all__ = [
    "get_or_embed",
    "normalize_question"
]