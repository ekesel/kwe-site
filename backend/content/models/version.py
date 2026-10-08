from django.db import models
from django.db.models import F
from django.utils import timezone


class ContentVersion(models.Model):
    """
    Single row that is bumped on every content change.

    The /api/content/ payload is cached in-process (locmem) per gunicorn worker; each
    request compares the cached version with this row (one cheap query) so a save handled
    by one worker invalidates the cache of every other worker as well.
    """

    version = models.PositiveBigIntegerField(default=1)
    updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = "Content version"

    def __str__(self):
        return f"v{self.version} @ {self.updated_at:%Y-%m-%d %H:%M}"

    @classmethod
    def current(cls) -> "ContentVersion":
        obj = cls.objects.order_by("pk").first()
        return obj or cls.objects.create()

    @classmethod
    def bump(cls) -> None:
        obj = cls.current()
        cls.objects.filter(pk=obj.pk).update(version=F("version") + 1, updated_at=timezone.now())
