from langchain_community.vectorstores import Chroma
from langchain.chains.question_answering import load_qa_chain
from langchain_community.chat_models import ChatOpenAI

from app.core.config import settings
from app.services.loader import load_all_pdfs_and_split
from app.services.embedder import embed_chunks

chunks = load_all_pdfs_and_split(settings.PDF_FOLDER_PATH)

embeddings = embed_chunks(chunks)
vectorstore = Chroma.from_texts(chunks, embedding=embeddings)

llm = ChatOpenAI(temperature=0, openai_api_key=settings.OPENAI_API_KEY)
chain = load_qa_chain(llm, chain_type="stuff")

def ask_question(question: str) -> str:
    docs = vectorstore.similarity_search(question)
    response = chain.run(input_documents=docs, question=question)
    return response