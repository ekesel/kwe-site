from django.db import models
from simple_history.models import HistoricalRecords
from solo.models import SingletonModel

from .base import ImageMixin, LinesField, Ordered

SPAN_CHOICES = [(3, "Narrow (3/12)"), (4, "Regular (4/12)"), (5, "Wide (5/12)")]


class TeamPageSettings(SingletonModel):
    """team.* (everything except the members and filters)."""

    hero_eyebrow = models.CharField("Eyebrow", max_length=80)
    hero_title = models.TextField("Title")
    hero_anchor_label = models.CharField("Anchor label", max_length=80, help_text='Jump link under the hero, e.g. "Meet the team".')
    hero_anchor_href = models.CharField("Anchor target", max_length=80, help_text='e.g. "#people"')
    hero_cta_label = models.CharField("CTA label", max_length=80)
    hero_cta_to = models.CharField("CTA route", max_length=200)

    search_placeholder = models.CharField(max_length=80, help_text="Placeholder of the name search box.")
    no_results = models.CharField("No-results message", max_length=160)
    clear = models.CharField("Clear-filters label", max_length=40)

    profile_back = models.CharField("Back link label", max_length=80, help_text="On a team member's profile page.")
    profile_focus_label = models.CharField("Focus label", max_length=40)
    profile_connect_label = models.CharField("Connect label", max_length=40)
    profile_connect_value = models.CharField("Connect value", max_length=40, help_text='Link text, e.g. "LinkedIn".')
    profile_firms_label = models.CharField("Prior firms label", max_length=40)

    prior_firms = LinesField("Prior firms marquee", help_text="Firm names shown in the scrolling strip.")

    matters_eyebrow = models.CharField("Eyebrow", max_length=80)
    matters_statement = models.TextField("Statement")
    matters_link_label = models.CharField("Link label", max_length=80)
    matters_link_to = models.CharField("Link route", max_length=200)

    history = HistoricalRecords()

    class Meta:
        verbose_name = "Team page settings"
        verbose_name_plural = "Team page settings"

    def __str__(self):
        return "Team page settings"


class TeamMember(Ordered, ImageMixin):
    """team.members[] — one profile; the slug is the URL (/team/<slug>)."""

    slug = models.SlugField(unique=True, help_text="URL of the profile page: /team/<slug>.")
    name = models.CharField(max_length=120)
    role = models.CharField(max_length=80, help_text='Job title shown on the card, e.g. "Founding Partner".')
    focus = models.CharField(max_length=80, help_text='Area of focus (also the "Role" filter value on the Team page).')
    firms = LinesField("Prior firms", help_text="Listed on the profile page.")
    span = models.PositiveSmallIntegerField(choices=SPAN_CHOICES, default=4, verbose_name="Card width", help_text="Width of the card in the Team grid on desktop.")
    bio = LinesField("Biography", help_text="One paragraph per line.")
    team = models.CharField(max_length=60, help_text='"Team" filter value, e.g. "Founding Partners".')
    region = models.CharField(max_length=60, help_text='"Region" filter value, e.g. "London".')
    history = HistoricalRecords()

    class Meta(Ordered.Meta):
        verbose_name = "Team member"
        verbose_name_plural = "Team members"

    def __str__(self):
        return self.name
