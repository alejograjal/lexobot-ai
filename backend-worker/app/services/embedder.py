from app.tenants import load_tenant_settings
from langchain_openai import OpenAIEmbeddings, ChatOpenAI

def get_embedding_model(tenant_id: str):
    conf = load_tenant_settings(tenant_id)
    return OpenAIEmbeddings(
        model=conf.get("embedding_model", "text-embedding-3-small"),
        openai_api_key=conf["openai_api_key"]
    )

def get_chat_model(tenant_id: str):
    conf = load_tenant_settings(tenant_id)
    return ChatOpenAI(
        temperature=0.5,
        openai_api_key=conf["openai_api_key"],
        model=conf.get("chat_model", "gpt-3.5-turbo")
    )