"""List-model admins: Team members, Solutions, Case studies, Insights, Extra cards."""

from django.contrib import admin
from unfold.decorators import display

from content import models as m

from .base import ImagePreviewMixin, OrderedStackedInline, OrderedTabularInline, SortableAdmin

IMAGE_FIELDS = ("image", "image_url", "image_preview_large")


@admin.register(m.TeamMember)
class TeamMemberAdmin(ImagePreviewMixin, SortableAdmin):
    list_display = ("image_preview", "name", "role", "focus", "team", "region")
    list_display_links = ("image_preview", "name")
    list_filter = ("team", "region", "focus")
    search_fields = ("name", "role", "focus", "bio")
    prepopulated_fields = {"slug": ("name",)}
    readonly_fields = ("image_preview_large",)
    fieldsets = (
        ("Identity", {"fields": ("name", "slug", "role", "focus")}),
        ("Photo", {"fields": IMAGE_FIELDS}),
        ("Profile", {"fields": ("bio", "firms")}),
        ("Grid & filters", {"fields": ("span", "team", "region"), "description": "Team / Region values must match the Team page filter options to be filterable."}),
    )

    def get_preview_path(self, obj):
        return f"/team/{obj.slug}" if obj else "/team"


class SolutionDeliverableInline(OrderedTabularInline):
    model = m.SolutionDeliverable
    fields = ("icon", "title")
    verbose_name_plural = "What we deliver"


class SolutionExpectationInline(OrderedStackedInline):
    model = m.SolutionExpectation
    fields = ("icon", "title", "body")
    verbose_name_plural = "What you can expect"


@admin.register(m.Solution)
class SolutionAdmin(ImagePreviewMixin, SortableAdmin):
    list_display = ("image_preview", "n", "title", "category", "slug")
    list_display_links = ("image_preview", "title")
    search_fields = ("title", "tagline", "lead", "category")
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("image_preview_large",)
    inlines = [SolutionDeliverableInline, SolutionExpectationInline]
    fieldsets = (
        ("Identity", {"classes": ["tab"], "fields": ("n", "title", "slug", "category", "tag")}),
        ("Listing", {"classes": ["tab"], "fields": ("tagline", "subtitle", "highlights", "card_body", "tint"), "description": "How the solution appears on the Solutions page and in “More solutions” cards."}),
        ("Detail page", {"classes": ["tab"], "fields": ("lead", "overview_before", "overview_highlight", "overview_after")}),
        ("Image", {"classes": ["tab"], "fields": IMAGE_FIELDS}),
    )

    def get_preview_path(self, obj):
        return f"/solution/{obj.slug}" if obj else "/solutions"


class CaseStudyApproachStepInline(OrderedStackedInline):
    model = m.CaseStudyApproachStep
    fields = ("title", "body")
    verbose_name_plural = "Approach steps"


class CaseStudyResultInline(OrderedTabularInline):
    model = m.CaseStudyResult
    fields = ("big", "small", "label")
    verbose_name_plural = "Result tiles"


@admin.register(m.CaseStudy)
class CaseStudyAdmin(ImagePreviewMixin, SortableAdmin):
    list_display = ("image_preview", "card_title", "strategy", "fund_type", "region", "category_group")
    list_display_links = ("image_preview", "card_title")
    list_filter = ("strategy", "fund_type", "region", "category_group")
    search_fields = ("title", "card_title", "key", "challenge", "outcome")
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("image_preview_large",)
    inlines = [CaseStudyApproachStepInline, CaseStudyResultInline]
    fieldsets = (
        ("Card", {"classes": ["tab"], "fields": ("card_title", "key", "category", "tags"), "description": "What appears on the Case studies grid and the Home slider."}),
        ("Detail page", {"classes": ["tab"], "fields": ("title", "slug", "subtitle", "meta", "challenge", "outcome", "quote_text", "quote_attribution")}),
        ("Filters", {"classes": ["tab"], "fields": ("strategy", "fund_type", "region", "category_group"), "description": "Values must match the Case studies filter options to be filterable."}),
        ("Image", {"classes": ["tab"], "fields": IMAGE_FIELDS}),
    )

    def get_preview_path(self, obj):
        return f"/case-study/{obj.slug}" if obj else "/case-studies"


class InsightStatInline(OrderedTabularInline):
    model = m.InsightStat
    fields = ("big", "unit", "label")
    verbose_name_plural = "Stats"


@admin.register(m.Insight)
class InsightAdmin(ImagePreviewMixin, SortableAdmin):
    list_display = ("image_preview", "title", "category", "date", "read")
    list_display_links = ("image_preview", "title")
    list_filter = ("category",)
    search_fields = ("title", "subtitle", "p1", "p2", "p3")
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("image_preview_large",)
    inlines = [InsightStatInline]
    fieldsets = (
        ("Card", {"classes": ["tab"], "fields": ("title", "slug", "category", "date", "read")}),
        ("Article", {"classes": ["tab"], "fields": ("subtitle", "toc", "h2", "p1", "p2", "quote", "p3"), "description": "Stat tiles between paragraph 1 and 2 are edited in the “Stats” tab."}),
        ("Image", {"classes": ["tab"], "fields": IMAGE_FIELDS}),
    )

    def get_preview_path(self, obj):
        return f"/insight/{obj.slug}" if obj else "/insights"


@admin.register(m.ExtraCard)
class ExtraCardAdmin(ImagePreviewMixin, SortableAdmin):
    list_display = ("image_preview", "title", "kind", "category")
    list_display_links = ("image_preview", "title")
    list_filter = ("kind",)
    search_fields = ("title", "category")
    readonly_fields = ("image_preview_large",)
    fieldsets = (
        (None, {"fields": ("kind", "title", "category")}),
        ("Image", {"fields": IMAGE_FIELDS}),
        ("Case-study card fields", {"classes": ["collapse"], "fields": ("tags", "strategy", "fund_type", "region", "category_group")}),
        ("Insight card fields", {"classes": ["collapse"], "fields": ("date", "read")}),
    )

    def get_preview_path(self, obj):
        return "/insights" if obj and obj.kind == "insights" else "/case-studies"

    @display(description="Kind", label={"caseStudies": "info", "insights": "success"})
    def kind_badge(self, obj):
        return obj.kind
