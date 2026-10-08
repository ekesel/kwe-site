"""Bump the content version (and drop this process's cached payload) whenever content changes."""

from django.apps import apps
from django.db.models.signals import post_delete, post_save

from .cache import invalidate_content

SKIP = {"ContentVersion", "MediaAsset"}


def _invalidate(sender, **kwargs):
    invalidate_content()


def connect():
    for model in apps.get_app_config("content").get_models():
        if model.__name__.startswith("Historical") or model.__name__ in SKIP:
            continue
        post_save.connect(_invalidate, sender=model, weak=False, dispatch_uid=f"content-inv-save-{model.__name__}")
        post_delete.connect(_invalidate, sender=model, weak=False, dispatch_uid=f"content-inv-del-{model.__name__}")


connect()
