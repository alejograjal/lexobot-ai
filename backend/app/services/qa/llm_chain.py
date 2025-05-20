from app.core.config import settings
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain.chains.combine_documents import create_stuff_documents_chain

llm = ChatOpenAI(temperature=0, openai_api_key=settings.OPENAI_API_KEY)

prompt = PromptTemplate.from_template("""
Usa el siguiente contexto para responder la pregunta al final.

Contexto:
{context}

Pregunta:
{question}
""".strip())


chain = create_stuff_documents_chain(
    llm=llm,
    prompt=prompt,
    document_variable_name="context"
)

def run_llm_chain(docs, question: str) -> str:
    return chain.invoke({"context": docs, "question": question})
