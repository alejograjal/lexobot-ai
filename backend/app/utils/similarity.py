from app.services.embedder import embedding_model
from sklearn.metrics.pairwise import cosine_similarity

SEMANTIC_SIMILARITY_THRESHOLD = 0.83

def are_questions_similar(q1: str, q2: str) -> bool:
    
    emb1 = embedding_model.embed_query(q1)
    emb2 = embedding_model.embed_query(q2)
    similarity = cosine_similarity([emb1], [emb2])[0][0]
    
    return similarity >= SEMANTIC_SIMILARITY_THRESHOLD