import os

def is_path_size_over_limit(path: str, max_size_mb: int) -> bool:
    if not os.path.exists(path):
        return False
    
    total_size = 0
    for dirpath, _, filenames in os.walk(path):
        for f in filenames:
            fp = os.path.join(dirpath, f)
            total_size += os.path.getsize(fp)
    
    max_size_bytes = max_size_mb * 1024 * 1024
    return total_size > max_size_bytes