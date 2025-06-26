from ..embedder import get_chat_model
from .memory_handler import get_memory
from app.utils import format_chat_history
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts.chat import ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate

prompt = ChatPromptTemplate.from_messages([
    SystemMessagePromptTemplate.from_template(
        "Eres un asistente útil, empático y conversacional que ayuda a residentes de condominios. "
        "Respondes preguntas de forma clara y natural basándote exclusivamente en el reglamento, facturas, actas y cualquier otro documento relevante proporcionado. "
        "Si no encuentras información suficiente para responder con certeza, sé honesto y no inventes. Pide más contexto o detalles de forma amable para poder ayudar mejor. "
        "Cuando respondas, intenta conectar con las personas, siendo amable, empático y cercano. "
        "Ten en cuenta el historial de conversación para responder de forma coherente con lo que el usuario ha preguntado antes. "
        "No repitas información innecesaria si ya se discutió."
    ),
    HumanMessagePromptTemplate.from_template(
        "Historial de conversación:\n{chat_history}\n\nContexto:\n{context}\n\nPregunta: {question}"
    )
])

async def run_llm_chain(tenant_id: str, session_id: str, docs, question: str) -> str:
    llm = await get_chat_model(tenant_id)
    memory = await get_memory(tenant_id, session_id)

    chat_history_text = format_chat_history(memory.chat_memory.messages)

    chain = create_stuff_documents_chain(
        llm=llm,
        prompt=prompt,
        document_variable_name="context"
    )

    result = await chain.ainvoke({
        "context": docs,
        "question": question,
        "chat_history": chat_history_text
    })

    memory.chat_memory.add_user_message(question)
    memory.chat_memory.add_ai_message(result)

    return result
