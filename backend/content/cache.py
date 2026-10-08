"""
Cached content payload for the public API.

The payload is cached in the Django cache (locmem, per process).  A ContentVersion row in
the database is bumped on every content change; get_payload() compares the cached version
with the database version on each request, so stale copies in other worker processes are
rebuilt on their next request.
"""

from django.core.cache import cache

CACHE_KEY = "content:payload"


def get_payload() -> dict:
    from .assemble import build_content
    from .models import ContentVersion

    current = ContentVersion.current()
    cached = cache.get(CACHE_KEY)
    if cached is not None and cached.get("version") == current.version:
        return {"data": cached["data"], "updated_at": cached["updated_at"]}
    payload = {"version": current.version, "data": build_content(), "updated_at": current.updated_at.isoformat()}
    cache.set(CACHE_KEY, payload, None)
    return {"data": payload["data"], "updated_at": payload["updated_at"]}


def invalidate_content() -> None:
    """Bump the shared version and drop this process's cached copy."""
    from .models import ContentVersion

    ContentVersion.bump()
    cache.delete(CACHE_KEY)
