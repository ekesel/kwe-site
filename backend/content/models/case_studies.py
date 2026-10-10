from django.db import models
from simple_history.models import HistoricalRecords
from solo.models import SingletonModel

from .base import ImageMixin, LinesField, Ordered


class CaseStudiesPageSettings(SingletonModel):
    """caseStudies.* (everything except items, extra cards and filters)."""

    hero_eyebrow = models.CharField("Eyebrow", max_length=80)
    hero_title = models.CharField("Title", max_length=200)
    hero_subtitle = models.TextField("Subtitle")

    controls_categories = models.CharField("Categories label", max_length=40)
    controls_read_more = models.CharField("Read-more label", max_length=40, help_text="Link label on each card.")
    controls_showing = models.CharField("Showing text", max_length=80, help_text='Use {shown} and {total} placeholders, e.g. "Showing {shown} of {total}".')
    controls_load_more = models.CharField("Load-more label", max_length=40)
    controls_clear = models.CharField("Clear-filters label", max_length=40)
    controls_no_results = models.CharField("No-results message", max_length=160)
    page_size = models.PositiveSmallIntegerField(default=6, help_text="Cards shown before the Load more button.")

    detail_back = models.CharField("Back link label", max_length=80)
    detail_tag = models.CharField("Hero tag", max_length=40, help_text='Small tag in the detail hero, e.g. "Case study".')
    detail_meta_labels = LinesField("Meta labels", help_text="Labels of the meta row (Service, Client, Duration), matched by position with each case study's meta values.")
    detail_challenge = models.CharField("Challenge heading", max_length=80)
    detail_approach = models.CharField("Approach heading", max_length=80)
    detail_results = models.CharField("Results heading", max_length=80)
    detail_more_eyebrow = models.CharField("More-case-studies eyebrow", max_length=80)
    detail_more_title = models.CharField("More-case-studies title", max_length=200)



    history = HistoricalRecords()

    class Meta:
        verbose_name = "Case studies page settings"
        verbose_name_plural = "Case studies page settings"

    def __str__(self):
        return "Case studies page settings"


class CaseStudy(Ordered, ImageMixin):
    """caseStudies.items[] — the slug is the URL (/case-study/<slug>)."""

    slug = models.SlugField(unique=True, help_text="URL of the detail page: /case-study/<slug>.")
    category = models.CharField(max_length=80, help_text='Service line shown as the tag in the detail hero and on the Home slider, e.g. "Fundraising Engagement & Execution".')
    card_title = models.CharField("Card title", max_length=200, help_text="Title on the listing card (can differ from the page title).")
    title = models.CharField(max_length=200)
    subtitle = models.TextField(help_text="Standfirst in the detail hero.")
    meta = LinesField("Meta values", help_text="Values matching the meta labels on the Case studies page settings (Service, Client, Duration). Leave a line empty to hide it.")
    challenge_heading = models.CharField("Challenge heading", max_length=200, default="")
    challenge = models.TextField("Challenge body", help_text="Blank line = new paragraph, lines starting with “- ” are bullets, **text** is bold.")
    approach_heading = models.CharField("Approach heading", max_length=200, default="")
    results_heading = models.CharField("Results heading", max_length=200, default="")
    results = models.TextField("Results body", default="", help_text="Blank line = new paragraph, lines starting with “- ” are bullets, **text** is bold.")

    strategy = models.CharField(max_length=60, help_text='"Strategy" filter value.')
    fund_type = models.CharField("Fund type", max_length=60, help_text='"Fund type" filter value.')
    region = models.CharField(max_length=60, help_text='"Region" filter value.')
    category_group = models.CharField("Category group", max_length=80, help_text='"Categories" filter value.')
    history = HistoricalRecords()

    class Meta(Ordered.Meta):
        verbose_name = "Case study"
        verbose_name_plural = "Case studies"

    def __str__(self):
        return self.title


class CaseStudyApproachStep(Ordered):
    """caseStudies.items[].approach.steps[]"""

    case_study = models.ForeignKey(CaseStudy, related_name="approach_steps", on_delete=models.CASCADE)
    title = models.CharField(max_length=120)
    body = models.TextField(help_text="Blank line = new paragraph, lines starting with “- ” are bullets, **text** is bold.")
    history = HistoricalRecords()

    class Meta(Ordered.Meta):
        verbose_name = "Approach step"
        verbose_name_plural = "Approach steps"

    def __str__(self):
        return self.title
