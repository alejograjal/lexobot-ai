from app.cache.embedding_cache import get_or_embed
from sklearn.metrics.pairwise import cosine_similarity

SEMANTIC_SIMILARITY_THRESHOLD = 0.83

def are_questions_similar(tenant_id: str,q1: str, q2: str) -> bool:    
    emb1 = get_or_embed(tenant_id, q1)
    emb2 = get_or_embed(tenant_id, q2)
    similarity = cosine_similarity([emb1], [emb2])[0][0]
    
    return similarity >= SEMANTIC_SIMILARITY_THRESHOLD