from app.services.embedder import get_chat_model
from langchain_core.prompts import PromptTemplate
from langchain.chains.combine_documents import create_stuff_documents_chain

prompt = PromptTemplate.from_template("""
Usa el siguiente contexto para responder la pregunta al final.

Contexto:
{context}

Pregunta:
{question}
""".strip())

def run_llm_chain(tenant_id: str, docs, question: str) -> str:
    llm = get_chat_model(tenant_id)
    chain = create_stuff_documents_chain(
        llm=llm,
        prompt=prompt,
        document_variable_name="context"
    )
    return chain.invoke({"context": docs, "question": question})
