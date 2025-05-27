def is_asking_for_sources(question: str) -> bool:
    question = question.lower()
    triggers = [
        "de dónde sacaste",
        "cuál es la fuente",
        "dónde está eso",
        "me puedes decir la fuente",
        "de dónde viene eso",
        "mostrar fuentes",
    ]
    return any(trigger in question for trigger in triggers)

def format_chat_history(messages) -> str:
    formatted = []
    for msg in messages:
        if msg.type == "human":
            formatted.append(f"Usuario: {msg.content}")
        elif msg.type == "ai":
            formatted.append(f"Asistente: {msg.content}")
    return "\n".join(formatted)