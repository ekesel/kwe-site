from django.core.validators import RegexValidator
from django.db import models
from simple_history.models import HistoricalRecords
from solo.models import SingletonModel

from .base import ICON_CHOICES, ImageMixin, LinesField, Ordered

HEX_COLOUR = RegexValidator(r"^#(?:[0-9a-fA-F]{3}){1,2}$", "Enter a hex colour like #E4E9EA.")


class SolutionsPageSettings(SingletonModel):
    """solutions.* (everything except the solution items)."""

    hero_eyebrow = models.CharField("Eyebrow", max_length=80)
    hero_title = models.CharField("Title", max_length=200)
    hero_subtitle = models.TextField("Subtitle")

    why_title = models.CharField("Why KWE title", max_length=200, default="", help_text='Heading of the intro section, e.g. "Why KWE Advisors".')
    why_body = models.TextField("Why KWE body", default="")
    list_eyebrow = models.CharField("List eyebrow", max_length=80, help_text='Above the list of solutions, e.g. "Capabilities".')
    explore_label = models.CharField("Explore link label", max_length=80, help_text='Link on each solution row, e.g. "Explore capability".')

    detail_eyebrow = models.CharField("In-detail eyebrow", max_length=80)
    detail_title = models.CharField("In-detail title", max_length=200)

    glance_eyebrow = models.CharField("Eyebrow", max_length=80)
    glance_title = models.CharField("Title", max_length=200)
    glance_challenge_header = models.CharField("First column header", max_length=60, help_text='e.g. "Challenge"')
    glance_columns = LinesField("Column headers", help_text="The three capability columns, in order.")

    overview_eyebrow = models.CharField("Overview eyebrow", max_length=80, help_text="Solution detail page.")
    deliver_eyebrow = models.CharField("Deliverables eyebrow", max_length=80, help_text="Solution detail page.")
    expect_eyebrow = models.CharField("What-to-expect eyebrow", max_length=80, help_text="Solution detail page.")
    more_eyebrow = models.CharField("More-solutions eyebrow", max_length=80)
    more_title = models.CharField("More-solutions title", max_length=200)

    history = HistoricalRecords()

    class Meta:
        verbose_name = "Solutions page settings"
        verbose_name_plural = "Solutions page settings"

    def __str__(self):
        return "Solutions page settings"


class GlanceRow(Ordered):
    """solutions.glance.rows[] — one row of the 'At a glance' matrix."""

    page = models.ForeignKey(SolutionsPageSettings, related_name="glance_rows", on_delete=models.CASCADE)
    label = models.CharField(max_length=120, help_text="The challenge named in the first column.")
    col1 = models.BooleanField("Column 1", default=False, help_text="Addressed by the first capability column.")
    col2 = models.BooleanField("Column 2", default=False, help_text="Addressed by the second capability column.")
    col3 = models.BooleanField("Column 3", default=False, help_text="Addressed by the third capability column.")
    history = HistoricalRecords()

    class Meta(Ordered.Meta):
        verbose_name = "At-a-glance row"
        verbose_name_plural = "At-a-glance rows"

    def __str__(self):
        return self.label

    @property
    def cells(self):
        return [self.col1, self.col2, self.col3]


class Solution(Ordered, ImageMixin):
    """solutions.items[] — one capability; the slug is the URL (/solution/<slug>)."""

    slug = models.SlugField(unique=True, help_text="URL of the detail page: /solution/<slug>.")
    n = models.CharField("Number", max_length=4, help_text='e.g. "01"')
    category = models.CharField(max_length=80, help_text="Small label on the Solutions list row.")
    title = models.CharField(max_length=160)
    tagline = models.CharField(max_length=200, help_text="One-liner on the Solutions list row.")
    subtitle = models.CharField(max_length=160, help_text="Shown as the card subtitle on the Solutions page and detail hero.")
    lead = models.TextField(help_text="Lead paragraph on the detail page.")
    card_body = models.CharField("Card body", max_length=200, help_text='Short text on the "More solutions" cards.')
    tint = models.CharField(max_length=7, validators=[HEX_COLOUR], help_text='Background colour of the "More solutions" card, e.g. #E4E9EA.')
    tag = models.CharField(max_length=40, help_text='Small tag on the detail page, e.g. "Capability 01".')

    overview_before = models.TextField("Overview — text before highlight")
    overview_highlight = models.CharField("Overview — highlighted text", max_length=200)
    overview_after = models.TextField("Overview — text after highlight")

    highlights = LinesField("Highlights", help_text="Bullet list on the Solutions page row.")
    history = HistoricalRecords()

    class Meta(Ordered.Meta):
        verbose_name = "Solution"
        verbose_name_plural = "Solutions"

    def __str__(self):
        return self.title


class SolutionDeliverable(Ordered):
    """solutions.items[].deliverables[]"""

    solution = models.ForeignKey(Solution, related_name="deliverables", on_delete=models.CASCADE)
    icon = models.CharField(max_length=20, choices=ICON_CHOICES, default="check")
    title = models.CharField(max_length=160)
    history = HistoricalRecords()

    class Meta(Ordered.Meta):
        verbose_name = "Deliverable"
        verbose_name_plural = "Deliverables (What we deliver)"

    def __str__(self):
        return self.title


class SolutionExpectation(Ordered):
    """solutions.items[].expect[]"""

    solution = models.ForeignKey(Solution, related_name="expectations", on_delete=models.CASCADE)
    icon = models.CharField(max_length=20, choices=ICON_CHOICES, default="check")
    title = models.CharField(max_length=160)
    body = models.TextField()
    history = HistoricalRecords()

    class Meta(Ordered.Meta):
        verbose_name = "Expectation"
        verbose_name_plural = "Expectations (What you can expect)"

    def __str__(self):
        return self.title
