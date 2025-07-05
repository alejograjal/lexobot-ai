from datetime import datetime, date, time, timedelta, timezone

CR_TZ_OFFSET = timedelta(hours=-6)

def local_date_to_utc_range(local_date: date) -> tuple[datetime, datetime]:
    local_start = datetime.combine(local_date, time(0, 0))
    local_end = local_start + timedelta(days=1) - timedelta(microseconds=1)

    utc_start = (local_start - CR_TZ_OFFSET).replace(tzinfo=timezone.utc)
    utc_end = (local_end - CR_TZ_OFFSET).replace(tzinfo=timezone.utc)
    return utc_start, utc_end