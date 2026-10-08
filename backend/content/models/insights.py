from django.db import models
from simple_history.models import HistoricalRecords
from solo.models import SingletonModel

from .base import ImageMixin, LinesField, Ordered


class InsightsPageSettings(SingletonModel):
    """insights.* (everything except items, extra cards and filters)."""

    hero_eyebrow = models.CharField("Eyebrow", max_length=80)
    hero_title = models.CharField("Title", max_length=200)
    hero_scroll_cue = models.CharField("Scroll cue", max_length=60)

    controls_categories = models.CharField("Categories label", max_length=40)
    controls_filter = models.CharField("Filter label", max_length=40)
    controls_read_more = models.CharField("Read-more label", max_length=40)
    controls_showing = models.CharField("Showing text", max_length=80, help_text='Use {shown} and {total} placeholders.')
    controls_load_more = models.CharField("Load-more label", max_length=40)
    controls_tag_primary = models.CharField("Primary card tag", max_length=40, help_text='First tag on every insight card, e.g. "KWE insights".')
    controls_clear = models.CharField("Clear-filters label", max_length=40)
    controls_no_results = models.CharField("No-results message", max_length=160)
    page_size = models.PositiveSmallIntegerField(default=6, help_text="Cards shown before the Load more button.")

    follow_statement = models.TextField("Statement")
    follow_button = models.CharField("Button label", max_length=80, help_text="Links to the site LinkedIn URL.")
    follow_media_label = models.CharField("Media contacts label", max_length=80)

    article_back = models.CharField("Back link label", max_length=80)
    article_author = models.CharField("Author line", max_length=120, help_text="Shown on every article.")
    article_initials = models.CharField("Author initials", max_length=4)
    article_toc = models.CharField("Contents label", max_length=40, help_text='e.g. "On this page"')
    article_related = models.CharField("Related heading", max_length=80)

    history = HistoricalRecords()

    class Meta:
        verbose_name = "Insights page settings"
        verbose_name_plural = "Insights page settings"

    def __str__(self):
        return "Insights page settings"


class PressContact(Ordered):
    """insights.follow.contacts[]"""

    page = models.ForeignKey(InsightsPageSettings, related_name="press_contacts", on_delete=models.CASCADE)
    label = models.CharField(max_length=80, help_text='e.g. "Press enquiries"')
    value = models.CharField(max_length=120, help_text="Email address.")
    history = HistoricalRecords()

    class Meta(Ordered.Meta):
        verbose_name = "Media contact line"
        verbose_name_plural = "Media contact lines"

    def __str__(self):
        return f"{self.label}: {self.value}"


class Insight(Ordered, ImageMixin):
    """insights.items[] — one article; the slug is the URL (/insight/<slug>)."""

    slug = models.SlugField(unique=True, help_text="URL of the article: /insight/<slug>.")
    category = models.CharField(max_length=60, help_text='Topic, e.g. "Market note". Must match a Categories filter option to be filterable.')
    date = models.CharField(max_length=40, help_text='Display date, e.g. "18 Sep 2025".')
    read = models.CharField("Read time", max_length=40, help_text='e.g. "8 min read" — the number drives the Read time filter.')
    title = models.CharField(max_length=200)
    subtitle = models.TextField(help_text="Standfirst in the article hero.")
    toc = LinesField("Contents", help_text="Section titles shown in the sidebar.")
    h2 = models.CharField("Section heading", max_length=200)
    p1 = models.TextField("Paragraph 1")
    p2 = models.TextField("Paragraph 2")
    quote = models.TextField("Pull quote")
    p3 = models.TextField("Paragraph 3")
    history = HistoricalRecords()

    class Meta(Ordered.Meta):
        verbose_name = "Insight"
        verbose_name_plural = "Insights"

    def __str__(self):
        return self.title


class InsightStat(Ordered):
    """insights.items[].stats[]"""

    insight = models.ForeignKey(Insight, related_name="stats", on_delete=models.CASCADE)
    big = models.CharField("Big figure", max_length=20)
    unit = models.CharField(max_length=10, blank=True, help_text='e.g. "%", "×", "bps". Leave blank for none.')
    label = models.CharField(max_length=120)
    history = HistoricalRecords()

    class Meta(Ordered.Meta):
        verbose_name = "Stat"
        verbose_name_plural = "Stats"

    def __str__(self):
        return f"{self.big}{self.unit} {self.label}"
