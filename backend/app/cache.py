import time
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class SimpleCache:
    """Simple in-memory cache with TTL support"""
    
    def __init__(self, default_ttl: int = 300):  # 5 minutes default TTL
        self.cache: Dict[str, Dict[str, Any]] = {}
        self.default_ttl = default_ttl
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache if not expired"""
        if key not in self.cache:
            return None
        
        item = self.cache[key]
        
        # Check if expired
        if datetime.now() > item["expires_at"]:
            logger.debug(f"Cache key '{key}' expired, removing")
            del self.cache[key]
            return None
        
        logger.debug(f"Cache hit for key '{key}'")
        return item["value"]
    
    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        """Set value in cache with TTL"""
        if ttl is None:
            ttl = self.default_ttl
        
        expires_at = datetime.now() + timedelta(seconds=ttl)
        
        self.cache[key] = {
            "value": value,
            "expires_at": expires_at,
            "created_at": datetime.now()
        }
        
        logger.debug(f"Cache set for key '{key}' with TTL {ttl}s")
    
    def delete(self, key: str) -> bool:
        """Delete key from cache"""
        if key in self.cache:
            del self.cache[key]
            logger.debug(f"Cache key '{key}' deleted")
            return True
        return False
    
    def clear(self) -> None:
        """Clear all cache entries"""
        self.cache.clear()
        logger.debug("Cache cleared")
    
    def cleanup_expired(self) -> int:
        """Remove expired entries and return count"""
        now = datetime.now()
        expired_keys = [
            key for key, item in self.cache.items()
            if now > item["expires_at"]
        ]
        
        for key in expired_keys:
            del self.cache[key]
        
        if expired_keys:
            logger.debug(f"Cleaned up {len(expired_keys)} expired cache entries")
        
        return len(expired_keys)
    
    def stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        now = datetime.now()
        valid_entries = sum(
            1 for item in self.cache.values()
            if now <= item["expires_at"]
        )
        
        return {
            "total_entries": len(self.cache),
            "valid_entries": valid_entries,
            "expired_entries": len(self.cache) - valid_entries
        }

# Global cache instance
cache = SimpleCache(default_ttl=300)  # 5 minutes TTL