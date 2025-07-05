from app.core import redis_client
from collections import defaultdict
from typing import Dict, Any, Literal, List
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

async def get_metrics_overall(tenant_id: str, limit: int = 10) -> Dict[str, Any]:
    key_total = f"qa:top:{tenant_id}"
    
    all_questions_with_scores = await redis_client.zrange(key_total, 0, -1, withscores=True)
    total_questions = sum(int(score) for _, score in all_questions_with_scores)

    top_questions_raw = await redis_client.zrevrange(key_total, 0, limit - 1, withscores=True)
    top_questions = [
        {"question": q, "count": int(score)}
        for q, score in top_questions_raw
    ]

    return {
        "total": total_questions,
        "top_questions": top_questions
    }

async def get_metrics_grouped_by_period(
    tenant_id: str,
    period: Literal["day", "week", "month"]
) -> List[Dict[str, int]]:
    now = datetime.now(timezone.utc)
    today_local = (now - CR_TZ_OFFSET).date()

    if period == "day":
        date_str = today_local.strftime("%Y-%m-%d")
        key = f"qa:top:{tenant_id}:{date_str}"
        items = await redis_client.zrange(key, 0, -1, withscores=True)
        count = sum(int(score) for _, score in items)
        return [{"date": today_local.strftime("%d/%m"), "count": count}]

    elif period == "week":
        results = []
        for offset in range(6, -1, -1):
            d = today_local - timedelta(days=offset)
            key = f"qa:top:{tenant_id}:{d.strftime('%Y-%m-%d')}"
            items = await redis_client.zrange(key, 0, -1, withscores=True)
            count = sum(int(score) for _, score in items)
            results.append({"date": d.strftime("%d/%m"), "count": count})
        return results

    elif period == "month":
        results = []
        for offset in range(29, -1, -3):  # 28 días, de 3 en 3
            block_total = 0
            label_date = None

            for day in range(3):
                d = today_local - timedelta(days=offset - day)
                key = f"qa:top:{tenant_id}:{d.strftime('%Y-%m-%d')}"
                items = await redis_client.zrange(key, 0, -1, withscores=True)
                block_total += sum(int(score) for _, score in items)
                if label_date is None:
                    label_date = d.strftime("%d/%m")

            results.append({"date": label_date, "count": block_total})
        return results

    raise ValueError("Periodo inválido")

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