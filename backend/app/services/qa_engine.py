from langchain_community.vectorstores import Chroma
from langchain.chains.question_answering import load_qa_chain
from langchain_community.chat_models import ChatOpenAI
from app.services.embedder import embedding_model
from app.core.config import settings

vectorstore = Chroma(
    persist_directory=settings.VECTORSTORE_PATH,
    embedding_function=embedding_model
)

llm = ChatOpenAI(temperature=0, openai_api_key=settings.OPENAI_API_KEY)
chain = load_qa_chain(llm, chain_type="stuff")

def ask_question(question: str) -> str:
    docs = vectorstore.similarity_search(question)
    response = chain.run(input_documents=docs, question=question)
    return response
