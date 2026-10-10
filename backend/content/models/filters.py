from django.db import models
from simple_history.models import HistoricalRecords

from .base import Ordered


class FilterGroup(Ordered):
    """
    A list of filter options used on a listing page.

    kind
    ----
    * dropdown   – a labelled dropdown above the listing grid (team.filters, caseStudies.hero.filters).
                   The *key* names the item field it filters on (team, focus, region, strategy, fundType …).
    * categories – the "Categories" dropdown in the listing controls (controls.categoriesOptions).
    * readtime   – the Insights "Read time" dropdown (insights.controls.filterOptions).
    """

    PAGE_CHOICES = [("team", "Team"), ("caseStudies", "Case studies"), ("insights", "Insights")]
    KIND_CHOICES = [
        ("dropdown", "Filter dropdown"),
        ("categories", "Categories dropdown"),
        ("readtime", "Read-time dropdown"),
    ]

    page = models.CharField(max_length=20, choices=PAGE_CHOICES)
    kind = models.CharField(max_length=20, choices=KIND_CHOICES, default="dropdown")
    label = models.CharField(max_length=60, blank=True, help_text="Dropdown label shown to visitors (not used for Categories).")
    key = models.CharField(max_length=40, blank=True, help_text='Filter dropdowns only: the item field to filter on, e.g. "strategy", "fundType", "region", "team", "focus".')
    history = HistoricalRecords()

    class Meta(Ordered.Meta):
        verbose_name = "Filter group"
        verbose_name_plural = "Filter groups"

    def __str__(self):
        return f"{self.get_page_display()} · {self.label or self.get_kind_display()}"


class FilterOption(Ordered):
    group = models.ForeignKey(FilterGroup, related_name="options", on_delete=models.CASCADE)
    label = models.CharField(max_length=80, help_text="Shown to visitors. For dropdowns this must match the item field value exactly.")
    value = models.CharField(max_length=80, blank=True, help_text="Unused by the current site; kept for future filter types.")
    history = HistoricalRecords()

    class Meta(Ordered.Meta):
        verbose_name = "Filter option"
        verbose_name_plural = "Filter options"

    def __str__(self):
        return self.label
