from django.conf import settings
from django.core.exceptions import ValidationError


def _check_size(value, limit: int, label: str):
    size = getattr(value, "size", None)
    if size is not None and size > limit:
        mb = limit // (1024 * 1024)
        raise ValidationError(f"{label} is too large ({size / 1024 / 1024:.1f} MB). Maximum is {mb} MB.")


def validate_image_size(value):
    _check_size(value, settings.MAX_IMAGE_UPLOAD_BYTES, "Image")


def validate_video_size(value):
    _check_size(value, settings.MAX_VIDEO_UPLOAD_BYTES, "Video")
