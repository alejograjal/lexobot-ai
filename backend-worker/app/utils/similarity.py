import asyncio
from app.cache import get_or_embed
from sklearn.metrics.pairwise import cosine_similarity

SEMANTIC_SIMILARITY_THRESHOLD = 0.83

async def are_questions_semantically_similar(tenant_id: str,q1: str, q2: str) -> bool:    
    if q1 == q2:
        return True

    emb1, emb2 = await asyncio.gather(
        get_or_embed(tenant_id, q1),
        get_or_embed(tenant_id, q2)
    )
    
    if emb1 is None or emb2 is None:
        return False
    
    similarity = cosine_similarity([emb1], [emb2])[0][0]
    
    return similarity >= SEMANTIC_SIMILARITY_THRESHOLD