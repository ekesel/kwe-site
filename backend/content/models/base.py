"""
Shared building blocks for content models.

Conventions
-----------
* Lists of short strings (bullets, title lines, address lines …) are stored in a
  ``LinesField`` – a TextField where every line is one item.  ``lines(value)``
  turns it back into a list.  Simple for editors, database-agnostic.
* Every child/list model has an ``order`` column and ``Meta.ordering`` on it, so
  the public JSON always comes out in the editor-chosen order.
* Images/videos are an uploaded file **plus** an optional external URL fallback,
  so the current Unsplash/mixkit links can be imported as-is.  ``media_src``
  returns the uploaded file URL if present, else the external URL.
"""

from django.core.validators import FileExtensionValidator
from django.db import models

from content.validators import validate_image_size, validate_video_size

# Colour "tones" understood by the frontend (TONE_BG / TONE_FG / GRAD in ui.tsx).
TONE_CHOICES = [
    ("g1", "G1 — dark green (#061B20)"),
    ("g2", "G2 (#2D4748)"),
    ("g3", "G3 (#4C6569)"),
    ("g4", "G4 (#729597)"),
    ("g5", "G5 (#9CB5B9)"),
    ("g6", "G6 — light (#C5D4D7)"),
    ("berry", "Berry (#824270)"),
    ("aub", "Aubergine (#3B1931)"),
    ("sage", "Sage (#DCE5E6)"),
    ("blush", "Blush"),
    ("off", "Off-white (#FAFAFA)"),
    ("white", "White"),
]

# Icon names defined in frontend/src/components/ui.tsx (Icon component).
ICON_CHOICES = [
    ("target", "Target"),
    ("people", "People"),
    ("doc", "Document"),
    ("bank", "Bank"),
    ("globe", "Globe"),
    ("leaf", "Leaf"),
    ("map", "Map"),
    ("star", "Star"),
    ("layers", "Layers"),
    ("check", "Check"),
    ("puzzle", "Puzzle"),
    ("clock", "Clock"),
    ("chat", "Chat"),
    ("link", "Link"),
]

IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif", "svg", "avif"]
VIDEO_EXTENSIONS = ["mp4", "webm", "mov", "m4v"]


def lines(value: str | None) -> list[str]:
    """Split a LinesField value into a list (one item per non-empty line)."""
    if not value:
        return []
    return [ln.strip() for ln in value.replace("\r\n", "\n").split("\n") if ln.strip()]


def join_lines(items) -> str:
    return "\n".join(str(i) for i in (items or []))


def media_src(file_field, external_url: str) -> str:
    """Uploaded file URL if a file is set, otherwise the external URL."""
    if file_field:
        try:
            return file_field.url
        except ValueError:
            pass
    return external_url or ""


class LinesField(models.TextField):
    """TextField whose value is a list of strings, one per line."""

    SUFFIX = "One item per line."

    def __init__(self, *args, **kwargs):
        kwargs.setdefault("blank", True)
        self._base_help_text = kwargs.get("help_text") or ""
        kwargs["help_text"] = (self._base_help_text + " " if self._base_help_text else "") + self.SUFFIX
        super().__init__(*args, **kwargs)

    def deconstruct(self):
        # keep migrations stable: store the help text without the auto-appended suffix
        name, path, args, kwargs = super().deconstruct()
        if self._base_help_text:
            kwargs["help_text"] = self._base_help_text
        else:
            kwargs.pop("help_text", None)
        return name, path, args, kwargs


def image_field(help_text="", **kwargs):
    return models.ImageField(
        upload_to="uploads/%Y/%m/",
        blank=True,
        validators=[validate_image_size, FileExtensionValidator(IMAGE_EXTENSIONS)],
        help_text=(help_text + " " if help_text else "") + "Upload (max 10 MB: jpg, png, webp, gif, svg, avif). Leave empty to use the external URL below.",
        **kwargs,
    )


def image_url_field(help_text="", **kwargs):
    return models.URLField(
        blank=True,
        max_length=500,
        help_text=(help_text + " " if help_text else "") + "External image URL — used only when no file is uploaded.",
        **kwargs,
    )


def video_field(help_text="", **kwargs):
    return models.FileField(
        upload_to="uploads/%Y/%m/",
        blank=True,
        validators=[validate_video_size, FileExtensionValidator(VIDEO_EXTENSIONS)],
        help_text=(help_text + " " if help_text else "") + "Upload (max 100 MB: mp4, webm, mov). Leave empty to use the external URL below.",
        **kwargs,
    )


class Ordered(models.Model):
    """Abstract: gives a model a drag-and-drop ``order`` column."""

    order = models.PositiveIntegerField(default=0, db_index=True, verbose_name="Order")

    class Meta:
        abstract = True
        ordering = ["order", "pk"]


class ImageMixin(models.Model):
    """Abstract: uploaded image + external URL fallback."""

    image = image_field()
    image_url = image_url_field()

    class Meta:
        abstract = True

    @property
    def image_src(self) -> str:
        return media_src(self.image, self.image_url)


class LinkFields(models.Model):
    """Abstract: a label + internal route (``to``)."""

    label = models.CharField(max_length=120)
    to = models.CharField(max_length=200, verbose_name="Link (route)", help_text='Internal path, e.g. "/contact".')

    class Meta:
        abstract = True
