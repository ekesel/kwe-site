from django.db import models
from simple_history.models import HistoricalRecords
from solo.models import SingletonModel

from .base import ImageMixin, LinesField, Ordered


class CaseStudiesPageSettings(SingletonModel):
    """caseStudies.* (everything except items, extra cards and filters)."""

    hero_eyebrow = models.CharField("Eyebrow", max_length=80)
    hero_title = models.CharField("Title", max_length=200)
    hero_subtitle = models.TextField("Subtitle")
    hero_scroll_cue = models.CharField("Scroll cue", max_length=60)

    controls_categories = models.CharField("Categories label", max_length=40)
    controls_filter = models.CharField("Filter label", max_length=40)
    controls_read_more = models.CharField("Read-more label", max_length=40, help_text="Link label on each card.")
    controls_showing = models.CharField("Showing text", max_length=80, help_text='Use {shown} and {total} placeholders, e.g. "Showing {shown} of {total}".')
    controls_load_more = models.CharField("Load-more label", max_length=40)
    controls_clear = models.CharField("Clear-filters label", max_length=40)
    controls_no_results = models.CharField("No-results message", max_length=160)
    page_size = models.PositiveSmallIntegerField(default=6, help_text="Cards shown before the Load more button.")

    detail_back = models.CharField("Back link label", max_length=80)
    detail_tag = models.CharField("Hero tag", max_length=40, help_text='Small tag in the detail hero, e.g. "Case study".')
    detail_meta_labels = LinesField("Meta labels", help_text="The four labels of the meta row (Service, Duration, …), matched by position with each case study's meta values.")
    detail_challenge = models.CharField("Challenge heading", max_length=80)
    detail_approach = models.CharField("Approach heading", max_length=80)
    detail_results = models.CharField("Results heading", max_length=80)
    detail_more_eyebrow = models.CharField("More-case-studies eyebrow", max_length=80)
    detail_more_title = models.CharField("More-case-studies title", max_length=200)

    perspectives_eyebrow = models.CharField("Eyebrow", max_length=80)
    perspectives_title = models.CharField("Title", max_length=200)
    perspectives_note = models.CharField("Note", max_length=200, blank=True, help_text="Small note beside the title.")
    perspectives_compliance = models.TextField("Compliance notice", blank=True)

    trusted_eyebrow = models.CharField("Trusted-by eyebrow", max_length=80)
    trusted_logos = LinesField("Trusted-by logos", help_text="Firm names shown in the marquee.")
    trusted_note = models.TextField("Trusted-by note", blank=True)

    history = HistoricalRecords()

    class Meta:
        verbose_name = "Case studies page settings"
        verbose_name_plural = "Case studies page settings"

    def __str__(self):
        return "Case studies page settings"


class Perspective(Ordered):
    """caseStudies.perspectives.items[]"""

    page = models.ForeignKey(CaseStudiesPageSettings, related_name="perspectives", on_delete=models.CASCADE)
    quote = models.TextField()
    name = models.CharField(max_length=120)
    firm = models.CharField(max_length=80)
    history = HistoricalRecords()

    class Meta(Ordered.Meta):
        verbose_name = "Client perspective"
        verbose_name_plural = "Client perspectives"

    def __str__(self):
        return f"{self.name} — {self.firm}"


class CaseStudy(Ordered, ImageMixin):
    """caseStudies.items[] — the slug is the URL (/case-study/<slug>)."""

    slug = models.SlugField(unique=True, help_text="URL of the detail page: /case-study/<slug>.")
    key = models.CharField("Client label", max_length=120, help_text="Short client descriptor used on the Home slider, e.g. “European specialist credit manager”.")
    category = models.CharField(max_length=80, help_text='Card category line, e.g. "Direct lending · EMEA".')
    tags = LinesField("Card tags", help_text='Tags shown on the card, e.g. "Case study" and "Direct lending".')
    card_title = models.CharField("Card title", max_length=200, help_text="Title on the listing card (can differ from the page title).")
    title = models.CharField(max_length=200)
    subtitle = models.TextField(help_text="Standfirst in the detail hero.")
    meta = LinesField("Meta values", help_text="Four values matching the meta labels (Service, Duration, Strategy, Target market).")
    challenge = models.TextField()
    outcome = models.TextField(help_text="Closing paragraph in the results section.")
    quote_text = models.TextField("Quote", blank=True, help_text="Optional pull quote. Leave blank for none.")
    quote_attribution = models.CharField("Quote attribution", max_length=200, blank=True)

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
    """caseStudies.items[].approach[]"""

    case_study = models.ForeignKey(CaseStudy, related_name="approach_steps", on_delete=models.CASCADE)
    title = models.CharField(max_length=120)
    body = models.TextField()
    history = HistoricalRecords()

    class Meta(Ordered.Meta):
        verbose_name = "Approach step"
        verbose_name_plural = "Approach steps"

    def __str__(self):
        return self.title


class CaseStudyResult(Ordered):
    """caseStudies.items[].results[]"""

    case_study = models.ForeignKey(CaseStudy, related_name="results", on_delete=models.CASCADE)
    big = models.CharField("Big figure", max_length=20)
    small = models.CharField("Unit", max_length=20, blank=True, help_text='Small text after the figure, e.g. "mo".')
    label = models.CharField(max_length=120)
    history = HistoricalRecords()

    class Meta(Ordered.Meta):
        verbose_name = "Result tile"
        verbose_name_plural = "Result tiles"

    def __str__(self):
        return f"{self.big} {self.small} {self.label}"


class ExtraCard(Ordered, ImageMixin):
    """caseStudies.extraCards[] and insights.extraCards[] — placeholder cards without a detail page."""

    KIND_CHOICES = [("caseStudies", "Case studies grid"), ("insights", "Insights grid")]

    kind = models.CharField(max_length=20, choices=KIND_CHOICES, help_text="Which listing page the card appears on.")
    category = models.CharField(max_length=80)
    title = models.CharField(max_length=200)
    # case-study cards
    tags = LinesField("Card tags", help_text="Case-study cards only.")
    strategy = models.CharField(max_length=60, blank=True, help_text="Case-study cards: Strategy filter value.")
    fund_type = models.CharField("Fund type", max_length=60, blank=True, help_text="Case-study cards: Fund type filter value.")
    region = models.CharField(max_length=60, blank=True, help_text="Case-study cards: Region filter value.")
    category_group = models.CharField("Category group", max_length=80, blank=True, help_text="Case-study cards: Categories filter value.")
    # insight cards
    date = models.CharField(max_length=40, blank=True, help_text="Insight cards only.")
    read = models.CharField("Read time", max_length=40, blank=True, help_text='Insight cards only, e.g. "5 min read".')
    history = HistoricalRecords()

    class Meta(Ordered.Meta):
        verbose_name = "Extra card"
        verbose_name_plural = "Extra cards"

    def __str__(self):
        return self.title
