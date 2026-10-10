from django.db import models
from simple_history.models import HistoricalRecords
from solo.models import SingletonModel

from .base import LinesField, Ordered


class ContactPage(SingletonModel):
    """contact.* — the Contact page."""

    hero_eyebrow = models.CharField("Eyebrow", max_length=80)
    hero_title = models.CharField("Title", max_length=200)
    hero_subtitle = models.TextField("Subtitle")

    form_eyebrow = models.CharField("Eyebrow", max_length=80)
    form_title = models.CharField("Title", max_length=200)
    form_body = models.TextField("Body")
    form_email = models.EmailField("Email", help_text="Email shown beside the form.")
    field_name_label = models.CharField("Name — label", max_length=60)
    field_name_placeholder = models.CharField("Name — placeholder", max_length=60)
    field_email_label = models.CharField("Email — label", max_length=60)
    field_email_placeholder = models.CharField("Email — placeholder", max_length=60)
    field_company_label = models.CharField("Company — label", max_length=60)
    field_company_placeholder = models.CharField("Company — placeholder", max_length=60)
    field_message_label = models.CharField("Message — label", max_length=60)
    field_message_placeholder = models.CharField("Message — placeholder", max_length=60)
    form_submit = models.CharField("Submit button label", max_length=40)
    form_success = models.CharField("Success message", max_length=200)

    offices_title = models.CharField("Offices title", max_length=80)
    offices_maps_label = models.CharField("Maps link label", max_length=60, help_text='e.g. "View on Google maps"')

    media_title = models.CharField("Media contacts title", max_length=80)

    history = HistoricalRecords()

    class Meta:
        verbose_name = "Contact page"
        verbose_name_plural = "Contact page"

    def __str__(self):
        return "Contact page"


class Office(Ordered):
    """contact.offices.items[]"""

    page = models.ForeignKey(ContactPage, related_name="offices", on_delete=models.CASCADE)
    name = models.CharField(max_length=120, help_text="Legal entity / office name.")
    address = LinesField("Address")
    tel = models.CharField("Telephone", max_length=40)
    email = models.EmailField()
    maps = models.URLField("Google Maps link", max_length=300)
    history = HistoricalRecords()

    class Meta(Ordered.Meta):
        verbose_name = "Office"
        verbose_name_plural = "Offices"

    def __str__(self):
        return self.name


class MediaContact(Ordered):
    """contact.media.items[]"""

    page = models.ForeignKey(ContactPage, related_name="media_contacts", on_delete=models.CASCADE)
    name = models.CharField(max_length=120)
    role = models.CharField(max_length=80)
    tel = models.CharField("Telephone", max_length=40)
    email = models.EmailField()
    history = HistoricalRecords()

    class Meta(Ordered.Meta):
        verbose_name = "Media contact"
        verbose_name_plural = "Media contacts"

    def __str__(self):
        return self.name
