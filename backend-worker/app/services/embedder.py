from app.tenants import load_tenant_settings
from langchain_openai import OpenAIEmbeddings, ChatOpenAI

async def get_embedding_model(tenant_id: str):
    conf = await load_tenant_settings(tenant_id)
    model = conf["embedding_model"] if "embedding_model" in conf else "text-embedding-3-small"   
    return OpenAIEmbeddings(
        model=model,
        openai_api_key=conf["openai_api_key"]
    )

async def get_chat_model(tenant_id: str):
    conf = await load_tenant_settings(tenant_id)

    model = conf["chat_model"] if "chat_model" in conf else "gpt-3.5-turbo"

    return ChatOpenAI(
        temperature=0.5,
        openai_api_key=conf["openai_api_key"],
        model=model
    )