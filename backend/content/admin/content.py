"""List-model admins: Team members, Solutions, Case studies, Insights, Extra cards."""

from django.contrib import admin
from unfold.decorators import display

from content import models as m

from .base import ImagePreviewMixin, OrderedStackedInline, OrderedTabularInline, SortableAdmin

IMAGE_FIELDS = ("image", "image_url", "image_preview_large")


@admin.register(m.TeamMember)
class TeamMemberAdmin(ImagePreviewMixin, SortableAdmin):
    list_display = ("image_preview", "name", "role", "credential", "team", "region")
    list_display_links = ("image_preview", "name")
    list_filter = ("team", "region", "focus")
    search_fields = ("name", "role", "focus", "bio")
    prepopulated_fields = {"slug": ("name",)}
    readonly_fields = ("image_preview_large",)
    fieldsets = (
        ("Identity", {"fields": ("name", "slug", "role", "credential", "focus")}),
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


@admin.register(m.CaseStudy)
class CaseStudyAdmin(ImagePreviewMixin, SortableAdmin):
    list_display = ("image_preview", "card_title", "strategy", "fund_type", "region", "category_group")
    list_display_links = ("image_preview", "card_title")
    list_filter = ("strategy", "fund_type", "region", "category_group")
    search_fields = ("title", "card_title", "challenge", "results")
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("image_preview_large",)
    inlines = [CaseStudyApproachStepInline]
    fieldsets = (
        ("Card", {"classes": ["tab"], "fields": ("card_title", "category"), "description": "What appears on the Case studies grid and the Home slider."}),
        ("Detail page", {"classes": ["tab"], "fields": ("title", "slug", "subtitle", "meta", "challenge_heading", "challenge", "approach_heading", "results_heading", "results"), "description": "Approach steps are edited in the “Approach steps” tab."}),
        ("Filters", {"classes": ["tab"], "fields": ("strategy", "fund_type", "region", "category_group"), "description": "Values must match the Case studies filter options to be filterable."}),
        ("Image", {"classes": ["tab"], "fields": IMAGE_FIELDS}),
    )

    def get_preview_path(self, obj):
        return f"/case-study/{obj.slug}" if obj else "/case-studies"


@admin.register(m.Insight)
class InsightAdmin(ImagePreviewMixin, SortableAdmin):
    list_display = ("image_preview", "title", "category", "date", "read")
    list_display_links = ("image_preview", "title")
    list_filter = ("category",)
    search_fields = ("title", "subtitle", "body")
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("image_preview_large",)
    fieldsets = (
        ("Card", {"classes": ["tab"], "fields": ("title", "slug", "category", "date", "read")}),
        ("Article", {"classes": ["tab"], "fields": ("subtitle", "body")}),
        ("Image", {"classes": ["tab"], "fields": IMAGE_FIELDS}),
    )

    def get_preview_path(self, obj):
        return f"/insight/{obj.slug}" if obj else "/insights"
