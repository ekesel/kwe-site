from django.contrib import admin
from unfold.decorators import display

from content import models as m

from .base import OrderedTabularInline, SortableAdmin

PAGE_PATHS = {"team": "/team", "caseStudies": "/case-studies", "insights": "/insights"}


class FilterOptionInline(OrderedTabularInline):
    model = m.FilterOption
    fields = ("label", "value")
    tab = False


@admin.register(m.FilterGroup)
class FilterGroupAdmin(SortableAdmin):
    list_display = ("page_badge", "kind", "label", "key", "option_count")
    list_display_links = ("kind", "label")
    list_filter = ("page", "kind")
    search_fields = ("label", "key", "options__label")
    inlines = [FilterOptionInline]
    fieldsets = (
        (
            None,
            {
                "fields": ("page", "kind", "label", "key"),
                "description": (
                    "Hero dropdown: label + key (the item field it filters on). "
                    "Categories dropdown: options only. Topic chips (Insights): label shown, value = topic to match "
                    "(blank for “All”). Read-time dropdown (Insights): label + the two options."
                ),
            },
        ),
    )

    def get_preview_path(self, obj):
        return PAGE_PATHS.get(obj.page, "/") if obj else "/"

    @display(description="Page", label={"team": "info", "caseStudies": "success", "insights": "warning"})
    def page_badge(self, obj):
        return obj.page, obj.get_page_display()

    @display(description="Options")
    def option_count(self, obj):
        return obj.options.count()
