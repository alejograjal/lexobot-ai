import asyncio
from app.core import BillingError
from .llm_chain import run_llm_chain
from app.tenants import load_tenant_settings
from .vectorstore import retrieve_relevant_docs
from .metrics_logger import log_question_metrics
from app.services.billing import track_tokens, check_token_availability
from .cache_handler import get_similar_answer_or_none, store_answer_if_needed

async def ask_question(tenant_id: str, session_id: str, question: str) -> str:
    conf = await load_tenant_settings(tenant_id)
    if not conf.get("billing_active"):
        raise BillingError(identifier=tenant_id, message="Lamentamos informarte que el servicio está pausado por un retraso en el pago.", error_type="billing_error")
    
    cached_response, sources = await get_similar_answer_or_none(tenant_id, question)
    if cached_response:
        asyncio.create_task(log_question_metrics(tenant_id, question))
        return cached_response

    docs = await retrieve_relevant_docs(tenant_id, question)

    await check_token_availability(tenant_id, docs, question)

    response = await run_llm_chain(tenant_id, session_id, docs, question)
    await track_tokens(tenant_id, docs, question, response)
    await store_answer_if_needed(tenant_id, question, response, docs)

    asyncio.create_task(log_question_metrics(tenant_id, question))

    return response
