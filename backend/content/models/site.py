from django.db import models
from simple_history.models import HistoricalRecords
from solo.models import SingletonModel

from .base import LinkFields, Ordered, image_field, image_url_field, media_src, video_field


class SiteSettings(SingletonModel):
    """site.*, nav.cta, footer text, the footer CTA block (cta.*) and the 404 page."""

    # site
    name = models.CharField("Site name", max_length=80, help_text="Brand name as shown in the logo lock-up (lower case on the live site).")
    tagline = models.CharField(max_length=200, help_text="Shown under the logo in the footer.")
    email = models.EmailField(help_text="Main contact email (navigation menu).")
    linkedin = models.URLField("LinkedIn URL", max_length=300, help_text="Used by every LinkedIn link/button on the site.")
    hero_video = video_field("Background video for the full-screen hero on every page.")
    hero_video_url = models.CharField("Hero video URL", blank=True, max_length=500, help_text='Full URL or a path shipped with the site, e.g. "/media/hero.mp4" — used only when no file is uploaded.')
    hero_poster = image_field("Poster image shown before the hero video loads.")
    hero_poster_url = image_url_field()
    show_testimonials = models.BooleanField("Show testimonials & Trusted by", default=True, help_text="Untick to hide the Home testimonials and the Trusted-by names while client approval is pending.")

    # nav.cta
    nav_cta_label = models.CharField("Header button label", max_length=80, help_text='The pill button in the navigation bar, e.g. "Arrange a conversation".')
    nav_cta_to = models.CharField("Header button link", max_length=200, help_text='Internal path, e.g. "/contact".')

    # footer
    footer_email = models.EmailField("Footer email", default="", help_text="Shown in the footer's bottom row.")
    footer_linkedin_label = models.CharField("Footer LinkedIn label", max_length=40, default="LinkedIn", help_text="Link text in the footer's bottom row (links to the LinkedIn URL above).")
    footer_copyright = models.CharField("Copyright line", max_length=200)

    # footer CTA block
    cta_eyebrow = models.CharField("CTA eyebrow", max_length=80)
    cta_title = models.CharField("CTA title", max_length=200)
    cta_body = models.TextField("CTA body")
    cta_button_label = models.CharField("CTA button label", max_length=80)
    cta_button_to = models.CharField("CTA button link", max_length=200)

    # notFound
    not_found_code = models.CharField("404 code", max_length=10, default="404")
    not_found_title = models.CharField("404 title", max_length=200)
    not_found_body = models.TextField("404 body")
    not_found_button_label = models.CharField("404 button label", max_length=80)
    not_found_button_to = models.CharField("404 button link", max_length=200, default="/")

    history = HistoricalRecords()

    class Meta:
        verbose_name = "Site settings"
        verbose_name_plural = "Site settings"

    def __str__(self):
        return "Site settings"

    @property
    def hero_video_src(self):
        return media_src(self.hero_video, self.hero_video_url)

    @property
    def hero_poster_src(self):
        return media_src(self.hero_poster, self.hero_poster_url)


class NavLink(Ordered, LinkFields):
    """nav.links[] — the main navigation items."""

    history = HistoricalRecords()

    class Meta(Ordered.Meta):
        verbose_name = "Navigation link"
        verbose_name_plural = "Navigation links"

    def __str__(self):
        return self.label


class FooterColumn(Ordered):
    """footer.columns[]"""

    title = models.CharField(max_length=80, help_text="Column heading in the footer.")
    history = HistoricalRecords()

    class Meta(Ordered.Meta):
        verbose_name = "Footer column"
        verbose_name_plural = "Footer columns"

    def __str__(self):
        return self.title


class FooterLink(Ordered):
    """footer.columns[].links[] — either an internal route or an external href."""

    column = models.ForeignKey(FooterColumn, related_name="links", on_delete=models.CASCADE)
    label = models.CharField(max_length=120)
    to = models.CharField("Internal link", max_length=200, blank=True, help_text='Internal path, e.g. "/solutions". Leave blank if using an external link.')
    href = models.CharField("External link", max_length=300, blank=True, help_text='Full URL or mailto:, e.g. "mailto:contact@kweadvisors.com". Used only when no internal link is set.')
    history = HistoricalRecords()

    class Meta(Ordered.Meta):
        verbose_name = "Footer link"
        verbose_name_plural = "Footer links"

    def __str__(self):
        return self.label


class MediaAsset(models.Model):
    """A simple media library: upload a file here and copy its URL into any URL field."""

    title = models.CharField(max_length=120)
    file = models.FileField(upload_to="library/%Y/%m/", help_text="Image or video. Max 100 MB.")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Media asset"
        verbose_name_plural = "Media library"
        ordering = ["-uploaded_at"]

    def __str__(self):
        return self.title

    @property
    def url(self):
        return self.file.url if self.file else ""
