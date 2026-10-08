from django.db import models
from simple_history.models import HistoricalRecords
from solo.models import SingletonModel

from .base import Ordered


class LegalPage(SingletonModel):
    """legal.* — the Legal page."""

    eyebrow = models.CharField(max_length=80)
    title = models.CharField(max_length=200)
    updated = models.CharField("Last-updated line", max_length=200, help_text='Free text, e.g. "Last updated: 1 January 2026".')
    history = HistoricalRecords()

    class Meta:
        verbose_name = "Legal page"
        verbose_name_plural = "Legal page"

    def __str__(self):
        return "Legal page"


class LegalSection(Ordered):
    """legal.sections[]"""

    page = models.ForeignKey(LegalPage, related_name="sections", on_delete=models.CASCADE)
    heading = models.CharField(max_length=160)
    body = models.TextField()
    history = HistoricalRecords()

    class Meta(Ordered.Meta):
        verbose_name = "Legal section"
        verbose_name_plural = "Legal sections"

    def __str__(self):
        return self.heading
