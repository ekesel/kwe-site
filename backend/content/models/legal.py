from django.db import models
from simple_history.models import HistoricalRecords
from solo.models import SingletonModel

from .base import Ordered


class LegalPage(SingletonModel):
    """legal.* — the Legal page."""

    eyebrow = models.CharField(max_length=80)
    title = models.CharField(max_length=200)
    updated = models.CharField("Last-updated line", max_length=200, help_text='Free text, e.g. "Last updated: 1 January 2026".')
    draft_note = models.CharField("Draft note", max_length=120, blank=True, help_text="Badge shown at the top of the Privacy Policy and Terms pages while they await counsel review. Leave empty to hide.")
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


class LegalDocument(Ordered):
    """legal.documents[] — Privacy Policy, Terms & Conditions … served at /legal/<slug>."""

    slug = models.SlugField(unique=True, help_text="URL of the page: /legal/<slug>.")
    eyebrow = models.CharField(max_length=80)
    title = models.CharField(max_length=200)
    updated = models.CharField("Effective / updated line", max_length=200)
    intro = models.TextField(blank=True, help_text="Opening paragraph(s). Blank line = new paragraph, lines starting with “- ” are bullets.")
    disclaimer = models.TextField(blank=True, help_text="Small print at the end of the page.")
    compliance_note = models.TextField("Internal compliance note", blank=True, help_text="Shown as a tooltip on the draft badge.")
    history = HistoricalRecords()

    class Meta(Ordered.Meta):
        verbose_name = "Legal document"
        verbose_name_plural = "Legal documents"

    def __str__(self):
        return self.title


class LegalDocumentSection(Ordered):
    """legal.documents[].sections[]"""

    document = models.ForeignKey(LegalDocument, related_name="sections", on_delete=models.CASCADE)
    heading = models.CharField(max_length=160)
    body = models.TextField(help_text="Blank line = new paragraph, lines starting with “- ” are bullets.")
    history = HistoricalRecords()

    class Meta(Ordered.Meta):
        verbose_name = "Section"
        verbose_name_plural = "Sections"

    def __str__(self):
        return self.heading
