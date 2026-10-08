from django.db import models
from simple_history.models import HistoricalRecords
from solo.models import SingletonModel

from .base import ICON_CHOICES, TONE_CHOICES, LinesField, Ordered


class ProcessPage(SingletonModel):
    """process.* — the Our Process page."""

    hero_eyebrow = models.CharField("Eyebrow", max_length=80)
    hero_title = models.CharField("Title", max_length=200)
    hero_subtitle = models.TextField("Subtitle")
    hero_anchors = LinesField("Hero anchors", help_text='Short labels under the hero, e.g. "01 Analyze".')

    stepper_eyebrow = models.CharField("Eyebrow", max_length=80)
    stepper_next_label = models.CharField("Next button label", max_length=40)

    why_eyebrow = models.CharField("Eyebrow", max_length=80)
    why_title = models.CharField("Title", max_length=200)

    timeline_figure = models.CharField("Figure", max_length=20, help_text='Big number, e.g. "18–36".')
    timeline_text = models.TextField("Text", help_text="Sentence following the figure.")
    timeline_nodes = LinesField("Timeline nodes", help_text="Labels along the timeline.")

    faq_eyebrow = models.CharField("Eyebrow", max_length=80)
    faq_title = models.CharField("Title", max_length=200)

    history = HistoricalRecords()

    class Meta:
        verbose_name = "Our process page"
        verbose_name_plural = "Our process page"

    def __str__(self):
        return "Our process page"


class ProcessStep(Ordered):
    """process.stepper.steps[]"""

    page = models.ForeignKey(ProcessPage, related_name="steps", on_delete=models.CASCADE)
    n = models.CharField("Number", max_length=4)
    short = models.CharField("Short title", max_length=60, help_text="Used in the stepper tabs.")
    title = models.CharField(max_length=160)
    lead = models.TextField(help_text="One-sentence summary.")
    body = models.TextField()
    history = HistoricalRecords()

    class Meta(Ordered.Meta):
        verbose_name = "Process step"
        verbose_name_plural = "Process steps"

    def __str__(self):
        return f"{self.n} {self.title}"


class ProcessWhyCard(Ordered):
    """process.why.cards[]"""

    page = models.ForeignKey(ProcessPage, related_name="why_cards", on_delete=models.CASCADE)
    icon = models.CharField(max_length=20, choices=ICON_CHOICES, default="target")
    tone = models.CharField(max_length=10, choices=TONE_CHOICES, default="sage", help_text="Card background colour.")
    title = models.CharField(max_length=120)
    body = models.TextField()
    history = HistoricalRecords()

    class Meta(Ordered.Meta):
        verbose_name = "Why-KWE card"
        verbose_name_plural = "Why-KWE cards"

    def __str__(self):
        return self.title


class ProcessFaq(Ordered):
    """process.faq.items[]"""

    page = models.ForeignKey(ProcessPage, related_name="faqs", on_delete=models.CASCADE)
    q = models.CharField("Question", max_length=200)
    a = models.TextField("Answer")
    history = HistoricalRecords()

    class Meta(Ordered.Meta):
        verbose_name = "FAQ"
        verbose_name_plural = "FAQs"

    def __str__(self):
        return self.q
