from django.db import models
from simple_history.models import HistoricalRecords
from solo.models import SingletonModel

from .base import LinesField, Ordered


class StoryPage(SingletonModel):
    """story.* — the Our Story page."""

    hero_eyebrow = models.CharField("Eyebrow", max_length=80)
    hero_title = models.CharField("Title", max_length=200)
    hero_subtitle = LinesField("Subtitle", help_text="Each line renders on its own line.")

    who_eyebrow = models.CharField("Eyebrow", max_length=80)
    who_title = models.TextField("Title")
    who_button_label = models.CharField("Button label", max_length=80)
    who_button_to = models.CharField("Button route", max_length=200)

    mission_eyebrow = models.CharField("Eyebrow", max_length=80)
    mission_statement = models.TextField("Statement")

    background_eyebrow = models.CharField("Eyebrow", max_length=80)
    background_title = models.CharField("Title", max_length=200)
    background_button_label = models.CharField("Button label", max_length=80)
    background_button_to = models.CharField("Button route", max_length=200)

    respond_eyebrow = models.CharField("Eyebrow", max_length=80)
    respond_title = models.CharField("Title", max_length=200)
    respond_lead = models.CharField("Lead", max_length=200)
    respond_button_label = models.CharField("Button label", max_length=80)
    respond_button_to = models.CharField("Button route", max_length=200)

    vision_eyebrow = models.CharField("Eyebrow", max_length=80)
    vision_index = models.CharField("Index", max_length=4, help_text='Section number shown beside the vision statement, e.g. "05".')
    vision_before = models.TextField("Text before highlight")
    vision_highlight = models.CharField("Highlighted text", max_length=200, help_text="Rendered in the berry accent colour.")
    vision_after = models.TextField("Text after highlight")

    milestones_eyebrow = models.CharField("Eyebrow", max_length=80)
    milestones_title = models.CharField("Title", max_length=200)

    teaser_title = models.CharField("Team teaser title", max_length=200)
    teaser_link_label = models.CharField("Team teaser link label", max_length=80)
    teaser_link_to = models.CharField("Team teaser link route", max_length=200)

    history = HistoricalRecords()

    class Meta:
        verbose_name = "Our story page"
        verbose_name_plural = "Our story page"

    def __str__(self):
        return "Our story page"


class StoryAnchor(Ordered):
    """story.hero.anchors[] — jump links under the hero."""

    page = models.ForeignKey(StoryPage, related_name="anchors", on_delete=models.CASCADE)
    label = models.CharField(max_length=80)
    href = models.CharField("Anchor", max_length=80, help_text='Section id, e.g. "#mission".')
    history = HistoricalRecords()

    class Meta(Ordered.Meta):
        verbose_name = "Hero anchor link"
        verbose_name_plural = "Hero anchor links"

    def __str__(self):
        return self.label


class StoryPillar(Ordered):
    """story.who.pillars[]"""

    page = models.ForeignKey(StoryPage, related_name="pillars", on_delete=models.CASCADE)
    title = models.CharField(max_length=120)
    body = models.TextField()
    accent = models.BooleanField(default=False, help_text="Tick to draw the hairline in the berry accent colour.")
    history = HistoricalRecords()

    class Meta(Ordered.Meta):
        verbose_name = "Who-we-are pillar"
        verbose_name_plural = "Who-we-are pillars"

    def __str__(self):
        return self.title


class StoryStat(Ordered):
    """story.who.stats[]"""

    page = models.ForeignKey(StoryPage, related_name="stats", on_delete=models.CASCADE)
    figure = models.CharField(max_length=40)
    label = models.CharField(max_length=120)
    history = HistoricalRecords()

    class Meta(Ordered.Meta):
        verbose_name = "Who-we-are stat"
        verbose_name_plural = "Who-we-are stats"

    def __str__(self):
        return f"{self.figure} {self.label}"


class StoryBackgroundRow(Ordered):
    """story.background.rows[]"""

    page = models.ForeignKey(StoryPage, related_name="background_rows", on_delete=models.CASCADE)
    n = models.CharField("Number", max_length=4)
    label = models.CharField(max_length=80)
    body = models.TextField()
    history = HistoricalRecords()

    class Meta(Ordered.Meta):
        verbose_name = "Background row"
        verbose_name_plural = "Background rows"

    def __str__(self):
        return f"{self.n} {self.label}"


class StoryRespondStep(Ordered):
    """story.respond.steps[]"""

    page = models.ForeignKey(StoryPage, related_name="respond_steps", on_delete=models.CASCADE)
    n = models.CharField("Number", max_length=4)
    title = models.CharField(max_length=120)
    body = models.TextField()
    history = HistoricalRecords()

    class Meta(Ordered.Meta):
        verbose_name = "How-we-respond step"
        verbose_name_plural = "How-we-respond steps"

    def __str__(self):
        return f"{self.n} {self.title}"


class StoryMilestone(Ordered):
    """story.milestones.items[]"""

    page = models.ForeignKey(StoryPage, related_name="milestones", on_delete=models.CASCADE)
    year = models.CharField(max_length=12)
    text = models.TextField()
    current = models.BooleanField(default=False, help_text="Tick for the latest milestone (highlighted in berry).")
    history = HistoricalRecords()

    class Meta(Ordered.Meta):
        verbose_name = "Milestone"
        verbose_name_plural = "Milestones"

    def __str__(self):
        return self.year
