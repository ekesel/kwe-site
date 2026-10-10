from django.db import models
from simple_history.models import HistoricalRecords
from solo.models import SingletonModel

from .base import ICON_CHOICES, TONE_CHOICES, ImageMixin, LinesField, Ordered, image_field, image_url_field, media_src


class HomePage(SingletonModel):
    """home.* — every section of the Home page, in page order."""

    # hero
    hero_title = LinesField("Hero title", help_text="Each line is rendered on its own line of the headline.")
    hero_subtitle = models.TextField("Hero subtitle", blank=True, help_text="Supporting line under the headline.")
    hero_scroll_cue = models.CharField("Scroll cue", max_length=60, help_text='Small label at the bottom of the hero, e.g. "Scroll to discover". Used by the hero on every page.')

    # intro
    intro_eyebrow = models.CharField("Eyebrow", max_length=80)
    intro_statement = models.TextField("Statement", help_text="Large serif statement under the hero.")
    intro_link_label = models.CharField("Link label", max_length=80)
    intro_link_to = models.CharField("Link route", max_length=200)

    # stats
    stats_eyebrow = models.CharField("Eyebrow", max_length=80)
    stats_title = models.CharField("Title", max_length=200)

    # who we work with
    who_eyebrow = models.CharField("Eyebrow", max_length=80)
    who_title = models.TextField("Title")

    # the challenge
    challenge_eyebrow = models.CharField("Eyebrow", max_length=80)
    challenge_title = models.CharField("Title", max_length=200)
    challenge_body = models.TextField("Body")

    # traditional vs KWE comparison
    comparison_title = models.CharField("Heading", max_length=200, default="")
    comparison_traditional_label = models.CharField("Left column label", max_length=80, default="", help_text='e.g. "Traditional approach"')
    comparison_kwe_label = models.CharField("Right column label", max_length=80, default="", help_text='e.g. "The KWE model"')
    comparison_traditional_image = image_field("Background photo of the left column.")
    comparison_traditional_image_url = image_url_field()
    comparison_kwe_image = image_field("Background photo of the right column.")
    comparison_kwe_image_url = image_url_field()

    # what we do
    what_eyebrow = models.CharField("Eyebrow", max_length=80)
    what_title = models.CharField("Title", max_length=200)
    what_body = models.TextField("Body")

    # case studies teaser
    cases_eyebrow = models.CharField("Eyebrow", max_length=80)
    cases_title = models.CharField("Title", max_length=200)
    cases_link_label = models.CharField("Card link label", max_length=80, help_text='Label of the link on each case-study slide, e.g. "Read case study".')

    # team teaser
    team_eyebrow = models.CharField("Eyebrow", max_length=80)
    team_title = models.CharField("Title", max_length=200)
    team_subtitle = models.TextField("Subtitle", blank=True)
    team_link_label = models.CharField("Link label", max_length=80)
    team_link_to = models.CharField("Link route", max_length=200)

    # testimonials
    testimonials_eyebrow = models.CharField("Eyebrow", max_length=80)
    testimonials_title = models.CharField("Title", max_length=200)
    trusted_eyebrow = models.CharField("Trusted-by eyebrow", max_length=80, help_text='e.g. "We work with"')
    trusted_title = models.CharField("Trusted-by title", max_length=120, help_text='e.g. "Trusted by"')

    # insights teaser
    insights_label = models.CharField("Eyebrow", max_length=80)
    insights_title = models.CharField("Title", max_length=200)
    insights_button_label = models.CharField("Button label", max_length=80)
    insights_button_to = models.CharField("Button route", max_length=200)
    insights_read_more = models.CharField("Read-more label", max_length=60, help_text="Link label on each insight card.")

    history = HistoricalRecords()

    class Meta:
        verbose_name = "Home page"
        verbose_name_plural = "Home page"

    def __str__(self):
        return "Home page"

    @property
    def comparison_traditional_image_src(self):
        return media_src(self.comparison_traditional_image, self.comparison_traditional_image_url)

    @property
    def comparison_kwe_image_src(self):
        return media_src(self.comparison_kwe_image, self.comparison_kwe_image_url)


class HomeStat(Ordered, ImageMixin):
    """home.stats.items[]"""

    page = models.ForeignKey(HomePage, related_name="stats", on_delete=models.CASCADE)
    figure = models.CharField(max_length=40, help_text='Big number, e.g. "$7bn+"')
    label = models.CharField(max_length=120)
    tone = models.CharField(max_length=10, choices=TONE_CHOICES, default="g1", help_text="Tile background colour.")
    history = HistoricalRecords()

    class Meta(Ordered.Meta):
        verbose_name = "Stat tile"
        verbose_name_plural = "Stat tiles"

    def __str__(self):
        return f"{self.figure} {self.label}"


class HomeWhoTile(Ordered, ImageMixin):
    """home.who.groups[].tiles[] — consecutive tiles with the same group label form one group."""

    page = models.ForeignKey(HomePage, related_name="who_tiles", on_delete=models.CASCADE)
    group = models.CharField(max_length=80, default="", help_text='Group heading, e.g. "Private equity". Tiles with the same group are shown together.')
    label = models.CharField(max_length=80)
    tone = models.CharField(max_length=10, choices=TONE_CHOICES, default="g1")
    history = HistoricalRecords()

    class Meta(Ordered.Meta):
        verbose_name = "Who-we-work-with tile"
        verbose_name_plural = "Who-we-work-with tiles"

    def __str__(self):
        return self.label


class HomeChallengeItem(Ordered):
    """home.challenge.items[]"""

    page = models.ForeignKey(HomePage, related_name="challenge_items", on_delete=models.CASCADE)
    icon = models.CharField(max_length=20, choices=ICON_CHOICES, default="target")
    title = models.CharField(max_length=120)
    body = models.TextField()
    history = HistoricalRecords()

    class Meta(Ordered.Meta):
        verbose_name = "Challenge item"
        verbose_name_plural = "Challenge items"

    def __str__(self):
        return self.title


class HomeComparisonRow(Ordered):
    """home.comparison.rows[]"""

    page = models.ForeignKey(HomePage, related_name="comparison_rows", on_delete=models.CASCADE)
    label = models.CharField(max_length=80, help_text='Row label, e.g. "Coverage".')
    traditional = models.CharField("Traditional approach", max_length=200)
    kwe = models.CharField("KWE model", max_length=200)
    history = HistoricalRecords()

    class Meta(Ordered.Meta):
        verbose_name = "Comparison row"
        verbose_name_plural = "Comparison rows"

    def __str__(self):
        return self.label


class HomeWhatCard(Ordered, ImageMixin):
    """home.whatWeDo.cards[]"""

    page = models.ForeignKey(HomePage, related_name="what_cards", on_delete=models.CASCADE)
    n = models.CharField("Number", max_length=4, help_text='e.g. "01"')
    title = models.CharField(max_length=120)
    subtitle = models.CharField(max_length=160)
    body = models.TextField()
    to = models.CharField("Link route", max_length=200, help_text='e.g. "/solution/capital-formation-advisory"')
    history = HistoricalRecords()

    class Meta(Ordered.Meta):
        verbose_name = "What-we-do card"
        verbose_name_plural = "What-we-do cards"

    def __str__(self):
        return f"{self.n} {self.title}"


class HomeTestimonial(Ordered, ImageMixin):
    """home.testimonials.items[]"""

    page = models.ForeignKey(HomePage, related_name="testimonials", on_delete=models.CASCADE)
    firm = models.CharField(max_length=80)
    quote = models.TextField()
    name = models.CharField(max_length=120)
    role = models.CharField(max_length=200)
    tone = models.CharField(max_length=10, choices=TONE_CHOICES, default="g1", help_text="Card gradient.")
    history = HistoricalRecords()

    class Meta(Ordered.Meta):
        verbose_name = "Testimonial"
        verbose_name_plural = "Testimonials"

    def __str__(self):
        return f"{self.name} — {self.firm}"


class HomeTrustedLogo(Ordered):
    """home.testimonials.logos[] — placeholder logo row (firm-type glyph + name) until real client logos are supplied."""

    page = models.ForeignKey(HomePage, related_name="trusted_logos", on_delete=models.CASCADE)
    name = models.CharField(max_length=80)
    icon = models.CharField(max_length=20, choices=ICON_CHOICES, default="bank", help_text="Generic firm-type glyph shown next to the name.")
    history = HistoricalRecords()

    class Meta(Ordered.Meta):
        verbose_name = "Trusted-by logo"
        verbose_name_plural = "Trusted-by logos"

    def __str__(self):
        return self.name
