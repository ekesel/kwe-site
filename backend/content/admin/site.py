from django.contrib import admin
from django.utils.html import format_html
from unfold.decorators import display

from content import models as m

from .base import HistoryAdmin, OrderedTabularInline, SingletonAdmin, SortableAdmin, thumb


@admin.register(m.SiteSettings)
class SiteSettingsAdmin(SingletonAdmin):
    preview_path = "/"
    readonly_fields = ("hero_poster_preview",)
    fieldsets = (
        ("Brand", {"classes": ["tab"], "fields": ("name", "tagline", "email", "linkedin")}),
        (
            "Hero video",
            {
                "classes": ["tab"],
                "description": "The full-screen background video used by every page hero.",
                "fields": ("hero_video", "hero_video_url", "hero_poster", "hero_poster_url", "hero_poster_preview"),
            },
        ),
        ("Header button", {"classes": ["tab"], "fields": ("nav_cta_label", "nav_cta_to")}),
        ("Footer", {"classes": ["tab"], "fields": ("footer_disclosure", "footer_copyright")}),
        (
            "CTA band",
            {
                "classes": ["tab"],
                "description": "The “Ready to transform your business?” band shown above the footer on most pages.",
                "fields": ("cta_eyebrow", "cta_title", "cta_body", "cta_button_label", "cta_button_to"),
            },
        ),
        (
            "404 page",
            {
                "classes": ["tab"],
                "fields": ("not_found_code", "not_found_title", "not_found_body", "not_found_button_label", "not_found_button_to"),
            },
        ),
    )

    @display(description="Current poster")
    def hero_poster_preview(self, obj):
        return thumb(obj.hero_poster_src, 120)


@admin.register(m.NavLink)
class NavLinkAdmin(SortableAdmin):
    preview_path = "/"
    list_display = ("label", "to")
    search_fields = ("label", "to")


class FooterLinkInline(OrderedTabularInline):
    model = m.FooterLink
    fields = ("label", "to", "href")
    tab = False


@admin.register(m.FooterColumn)
class FooterColumnAdmin(SortableAdmin):
    preview_path = "/"
    list_display = ("title", "link_count")
    inlines = [FooterLinkInline]

    @display(description="Links")
    def link_count(self, obj):
        return obj.links.count()


@admin.register(m.MediaAsset)
class MediaAssetAdmin(HistoryAdmin):
    preview_path = None
    list_display = ("preview", "title", "file_url", "uploaded_at")
    search_fields = ("title",)
    readonly_fields = ("file_url", "preview_large")
    fields = ("title", "file", "file_url", "preview_large")
    ordering = ("-uploaded_at",)

    @display(description="Preview")
    def preview(self, obj):
        return thumb(obj.url) if obj.url.lower().split("?")[0].endswith(("jpg", "jpeg", "png", "webp", "gif", "svg", "avif")) else "🎞"

    @display(description="Preview")
    def preview_large(self, obj):
        return self.preview(obj) if obj.pk else "—"

    @display(description="URL (copy into any image/video URL field)")
    def file_url(self, obj):
        if not obj.pk or not obj.file:
            return "—"
        return format_html('<code style="user-select:all">{}</code>', obj.url)
