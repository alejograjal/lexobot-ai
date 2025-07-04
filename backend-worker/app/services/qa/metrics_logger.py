from typing import Dict, Any
from app.core import redis_client
from collections import defaultdict
from datetime import date, datetime, timedelta, timezone
from app.utils import local_date_to_utc_range, CR_TZ_OFFSET

async def log_question_metrics(tenant_id: str, question: str):
    now = datetime.now(timezone.utc)
    today = now.strftime("%Y-%m-%d")
    month = now.strftime("%Y-%m")
    week = f"{now.isocalendar().year}-W{now.isocalendar().week}"

    # 1. Daily historic log
    key_log = f"qa:logs:{tenant_id}:{today}"
    await redis_client.lpush(key_log, question)
    await redis_client.expire(key_log, 60 * 60 * 24 * 90)

    # 2. Global ranking
    await redis_client.zincrby(f"qa:top:{tenant_id}", 1, question)

    # 3. Daily ranking
    await redis_client.zincrby(f"qa:top:{tenant_id}:{today}", 1, question)
    await redis_client.expire(f"qa:top:{tenant_id}:{today}", 60 * 60 * 24 * 90)

    # 4. Weekly ranking
    await redis_client.zincrby(f"qa:top:{tenant_id}:week:{week}", 1, question)
    await redis_client.expire(f"qa:top:{tenant_id}:week:{week}", 60 * 60 * 24 * 120)

    # 5. Monthly ranking
    await redis_client.zincrby(f"qa:top:{tenant_id}:{month}", 1, question)
    await redis_client.expire(f"qa:top:{tenant_id}:{month}", 60 * 60 * 24 * 180)

async def get_metrics_summary(tenant_id: str, start: date, end: date, limit: int = 10) -> Dict[str, Any]:
    utc_start, _ = local_date_to_utc_range(start)
    _, utc_end = local_date_to_utc_range(end)

    by_day_utc = {}
    total = 0
    question_counter = {}

    date_cursor = utc_start.date()
    end_date = utc_end.date()

    while date_cursor <= end_date:
        date_str_utc = date_cursor.strftime("%Y-%m-%d")
        key = f"qa:logs:{tenant_id}:{date_str_utc}"
        count = await redis_client.llen(key)
        by_day_utc[date_str_utc] = count
        total += count

        questions = await redis_client.lrange(key, 0, -1)
        for q in questions:
            text = q
            question_counter[text] = question_counter.get(text, 0) + 1

        date_cursor += timedelta(days=1)

    by_day_local = defaultdict(int)
    for date_str_utc, count in by_day_utc.items():
        dt_utc = datetime.strptime(date_str_utc, "%Y-%m-%d")
        dt_local = (dt_utc - CR_TZ_OFFSET).date()
        by_day_local[dt_local.strftime("%Y-%m-%d")] += count

    filtered_by_day = [
        {"date": datetime.strptime(day_str, "%Y-%m-%d").strftime("%d/%m"), "count": cnt}
        for day_str, cnt in by_day_local.items()
        if start <= datetime.strptime(day_str, "%Y-%m-%d").date() <= end
    ]

    top_questions = sorted(
        [{"question": q, "count": c} for q, c in question_counter.items()],
        key=lambda x: x["count"],
        reverse=True
    )[:limit]

    return {
        "total": total,
        "by_day": filtered_by_day,
        "top_questions": top_questions
    }