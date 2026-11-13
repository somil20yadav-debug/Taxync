import json
import time
import logging
from typing import Optional

try:
    import redis
    _redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
    _redis_client.ping()
    logging.info("Connected to Redis server.")
except Exception:
    _redis_client = None
    logging.info("Redis not available. Using in-memory fallback cache.")

# In-memory storage fallback: { key: (data_str, expires_at) }
_memory_cache: dict = {}

def set_cache(key: str, value: dict, ttl_seconds: int = 86400) -> None:
    data_str = json.dumps(value)
    if _redis_client:
        try:
            _redis_client.setex(key, ttl_seconds, data_str)
            return
        except Exception as e:
            logging.warning(f"Redis write failed, falling back to memory: {e}")
    _memory_cache[key] = (data_str, time.time() + ttl_seconds)

def get_cache(key: str) -> Optional[dict]:
    if _redis_client:
        try:
            val = _redis_client.get(key)
            if val:
                return json.loads(val)
        except Exception as e:
            logging.warning(f"Redis read failed: {e}")
            
    # Check in-memory cache
    if key in _memory_cache:
        data_str, expires_at = _memory_cache[key]
        if time.time() < expires_at:
            return json.loads(data_str)
        del _memory_cache[key]
    return None
