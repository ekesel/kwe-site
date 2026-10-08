"""Shared admin building blocks (django-unfold + django-simple-history + singleton pages)."""

from django.conf import settings
from django.contrib import messages
from django.http import HttpResponseRedirect
from django.urls import path, reverse
from django.utils.html import format_html
from simple_history.admin import SimpleHistoryAdmin
from unfold.admin import ModelAdmin, StackedInline, TabularInline
from unfold.decorators import display


def site_url(path_: str = "") -> str:
    base = (settings.SITE_URL or "/").rstrip("/")
    return f"{base}/{path_.lstrip('/')}" if path_ else (base or "/")


def thumb(src: str, height: int = 44):
    if not src:
        return "—"
    return format_html(
        '<img src="{}" alt="" style="height:{}px;width:auto;max-width:120px;border-radius:6px;object-fit:cover" />',
        src,
        height,
    )


class PreviewMixin:
    """Adds "View site" and "Preview page" buttons to the change form header."""

    change_form_template = "admin/content/change_form.html"
    preview_path = ""  # e.g. "/team" – override or implement get_preview_path(obj)

    def get_preview_path(self, obj):
        return self.preview_path

    def changeform_view(self, request, object_id=None, form_url="", extra_context=None):
        extra_context = dict(extra_context or {})
        obj = None
        if object_id:
            try:
                obj = self.get_object(request, object_id)
            except Exception:  # pragma: no cover - defensive
                obj = None
        preview = self.get_preview_path(obj) if obj is not None else self.preview_path
        extra_context["site_view_url"] = site_url()
        extra_context["preview_url"] = site_url(preview) if preview is not None else None
        return super().changeform_view(request, object_id, form_url, extra_context)


class HistoryAdmin(PreviewMixin, SimpleHistoryAdmin, ModelAdmin):
    """Unfold ModelAdmin with a History tab (view + revert)."""

    history_list_display = ["history_change_reason"]
    warn_unsaved_form = True
    list_fullwidth = True


class SortableAdmin(HistoryAdmin):
    """List model with drag-and-drop ordering in the changelist."""

    ordering_field = "order"
    hide_ordering_field = True


class SingletonAdmin(HistoryAdmin):
    """
    One-row "page" models: the list view redirects straight to the single change form,
    there is no Add or Delete, and Save returns to the same form.
    """

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    @property
    def _info(self):
        return self.model._meta.app_label, self.model._meta.model_name

    def get_urls(self):
        urls = super().get_urls()
        custom = [
            path("", self.admin_site.admin_view(self.redirect_to_singleton), name="%s_%s_changelist" % self._info),
        ]
        return custom + urls

    def redirect_to_singleton(self, request):
        obj = self.model.get_solo()
        return HttpResponseRedirect(reverse("admin:%s_%s_change" % self._info, args=[obj.pk]))

    def response_change(self, request, obj):
        if "_continue" in request.POST or "_addanother" in request.POST or "_saveasnew" in request.POST:
            return super().response_change(request, obj)
        self.message_user(request, f"{obj} was saved successfully.", messages.SUCCESS)
        if "/history/" in request.path:  # reverting from the History tab → back to the editor
            return HttpResponseRedirect(reverse("admin:%s_%s_change" % self._info, args=[obj.pk]))
        return HttpResponseRedirect(request.path)


class OrderedTabularInline(TabularInline):
    ordering_field = "order"
    hide_ordering_field = True
    extra = 0
    tab = True


class OrderedStackedInline(StackedInline):
    ordering_field = "order"
    hide_ordering_field = True
    extra = 0
    tab = True


class ImagePreviewMixin:
    """For models using ImageMixin (image + image_url)."""

    @display(description="Preview")
    def image_preview(self, obj):
        return thumb(obj.image_src)

    @display(description="Current image")
    def image_preview_large(self, obj):
        return thumb(obj.image_src, height=160)


__all__ = [
    "HistoryAdmin",
    "SortableAdmin",
    "SingletonAdmin",
    "OrderedTabularInline",
    "OrderedStackedInline",
    "ImagePreviewMixin",
    "thumb",
    "site_url",
]
