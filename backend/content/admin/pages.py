"""Singleton page admins: Home, Story, Process, Contact, Legal and the listing-page settings."""

from django.contrib import admin

from content import models as m

from .base import OrderedStackedInline, OrderedTabularInline, SingletonAdmin, SortableAdmin


def tab(name, fields, description=None):
    opts = {"classes": ["tab"], "fields": fields}
    if description:
        opts["description"] = description
    return (name, opts)


# ----------------------------------------------------------------------------- Home


class HomeStatInline(OrderedTabularInline):
    model = m.HomeStat
    fields = ("figure", "label", "tone", "image", "image_url")
    verbose_name_plural = "Stats — tiles"


class HomeWhoTileInline(OrderedTabularInline):
    model = m.HomeWhoTile
    fields = ("group", "label", "tone", "image", "image_url")
    verbose_name_plural = "Who we work with — tiles"


class HomeChallengeItemInline(OrderedStackedInline):
    model = m.HomeChallengeItem
    fields = ("icon", "title", "body")
    verbose_name_plural = "Challenge — items"


class HomeComparisonRowInline(OrderedTabularInline):
    model = m.HomeComparisonRow
    fields = ("label", "traditional", "kwe")
    verbose_name_plural = "Traditional vs KWE — rows"


class HomeWhatCardInline(OrderedStackedInline):
    model = m.HomeWhatCard
    fields = ("n", "title", "subtitle", "body", "to", "image", "image_url")
    verbose_name_plural = "What we do — cards"


class HomeTestimonialInline(OrderedStackedInline):
    model = m.HomeTestimonial
    fields = ("firm", "name", "role", "quote", "tone", "image", "image_url")
    verbose_name_plural = "Testimonials — items"


class HomeTrustedLogoInline(OrderedTabularInline):
    model = m.HomeTrustedLogo
    fields = ("name", "icon")
    verbose_name_plural = "Trusted by — logos"


@admin.register(m.HomePage)
class HomePageAdmin(SingletonAdmin):
    preview_path = "/"
    inlines = [
        HomeStatInline,
        HomeWhoTileInline,
        HomeChallengeItemInline,
        HomeComparisonRowInline,
        HomeWhatCardInline,
        HomeTestimonialInline,
        HomeTrustedLogoInline,
    ]
    fieldsets = (
        tab("Hero", ("hero_title", "hero_subtitle", "hero_scroll_cue"), "Full-screen video hero at the top of the Home page."),
        tab("Intro", ("intro_eyebrow", "intro_statement", "intro_link_label", "intro_link_to")),
        tab("Stats", ("stats_eyebrow", "stats_title"), "The tiles themselves are edited in the “Stats — tiles” tab."),
        tab("Who we work with", ("who_eyebrow", "who_title"), "Tiles are edited in the “Who we work with — tiles” tab."),
        tab("Challenge", ("challenge_eyebrow", "challenge_title", "challenge_body"), "Items are edited in the “Challenge — items” tab."),
        tab(
            "Traditional vs KWE",
            ("comparison_title", "comparison_traditional_label", "comparison_kwe_label", "comparison_traditional_image", "comparison_traditional_image_url", "comparison_kwe_image", "comparison_kwe_image_url"),
            "The two-column comparison block. Rows are edited in the “Traditional vs KWE — rows” tab.",
        ),
        tab("What we do", ("what_eyebrow", "what_title", "what_body"), "Cards are edited in the “What we do — cards” tab."),
        tab("Case studies teaser", ("cases_eyebrow", "cases_title", "cases_link_label"), "The slider shows the case studies from Content → Case studies."),
        tab("Team teaser", ("team_eyebrow", "team_title", "team_subtitle", "team_link_label", "team_link_to"), "Shows the people from Content → Team members."),
        tab(
            "Testimonials",
            ("testimonials_eyebrow", "testimonials_title", "trusted_eyebrow", "trusted_title"),
            "Quotes and logos are edited in the “Testimonials — items” and “Trusted by — logos” tabs.",
        ),
        tab("Insights teaser", ("insights_label", "insights_title", "insights_button_label", "insights_button_to", "insights_read_more"), "Shows the latest articles from Content → Insights."),
    )


# ----------------------------------------------------------------------------- Story


class StoryPillarInline(OrderedStackedInline):
    model = m.StoryPillar
    fields = ("title", "body", "accent")
    verbose_name_plural = "Who we are — pillars"


class StoryStatInline(OrderedTabularInline):
    model = m.StoryStat
    fields = ("figure", "label")
    verbose_name_plural = "Who we are — stats"


class StoryBackgroundRowInline(OrderedStackedInline):
    model = m.StoryBackgroundRow
    fields = ("n", "label", "body")
    verbose_name_plural = "Background — rows"


class StoryRespondStepInline(OrderedStackedInline):
    model = m.StoryRespondStep
    fields = ("n", "title", "body")
    verbose_name_plural = "How we respond — steps"


class StoryMilestoneInline(OrderedTabularInline):
    model = m.StoryMilestone
    fields = ("year", "text", "current")
    verbose_name_plural = "Milestones — items"


@admin.register(m.StoryPage)
class StoryPageAdmin(SingletonAdmin):
    preview_path = "/story"
    inlines = [
        StoryPillarInline,
        StoryStatInline,
        StoryBackgroundRowInline,
        StoryRespondStepInline,
        StoryMilestoneInline,
    ]
    fieldsets = (
        tab("Hero", ("hero_eyebrow", "hero_kicker", "hero_title", "hero_subtitle"), "The eyebrow is the page label (browser tab title); the hero itself shows the title and subtitle."),
        tab("Who we are", ("who_eyebrow", "who_title", "who_button_label", "who_button_to")),
        tab("Mission", ("mission_eyebrow", "mission_statement")),
        tab("Background", ("background_eyebrow", "background_title", "background_button_label", "background_button_to")),
        tab("How we respond", ("respond_eyebrow", "respond_title", "respond_lead", "respond_button_label", "respond_button_to")),
        tab("Vision", ("vision_eyebrow", "vision_before", "vision_highlight", "vision_after")),
        tab("Milestones", ("milestones_eyebrow", "milestones_title")),
        tab("Team teaser", ("teaser_title", "teaser_link_label", "teaser_link_to")),
    )


# ----------------------------------------------------------------------------- Process


class ProcessStepInline(OrderedStackedInline):
    model = m.ProcessStep
    fields = ("n", "short", "title", "lead", "body")
    verbose_name_plural = "Stepper — steps"


class ProcessWhyCardInline(OrderedStackedInline):
    model = m.ProcessWhyCard
    fields = ("icon", "tone", "title", "body")
    verbose_name_plural = "Why KWE — cards"


class ProcessFaqInline(OrderedStackedInline):
    model = m.ProcessFaq
    fields = ("q", "a")
    verbose_name_plural = "FAQ — questions"


@admin.register(m.ProcessPage)
class ProcessPageAdmin(SingletonAdmin):
    preview_path = "/process"
    inlines = [ProcessStepInline, ProcessWhyCardInline, ProcessFaqInline]
    fieldsets = (
        tab("Hero", ("hero_eyebrow", "hero_title", "hero_subtitle")),
        tab("Stepper", ("stepper_eyebrow", "stepper_next_label"), "Steps are edited in the “Stepper — steps” tab."),
        tab("Why KWE", ("why_eyebrow", "why_title")),
        tab("Timeline", ("timeline_figure", "timeline_text", "timeline_nodes")),
        tab("FAQ", ("faq_eyebrow", "faq_title")),
    )


# ----------------------------------------------------------------------------- Contact


class OfficeInline(OrderedStackedInline):
    model = m.Office
    fields = ("name", "address", "tel", "email", "maps")
    verbose_name_plural = "Offices"


class MediaContactInline(OrderedTabularInline):
    model = m.MediaContact
    fields = ("name", "role", "tel", "email")
    verbose_name_plural = "Media contacts"


@admin.register(m.ContactPage)
class ContactPageAdmin(SingletonAdmin):
    preview_path = "/contact"
    inlines = [OfficeInline, MediaContactInline]
    fieldsets = (
        tab("Hero", ("hero_eyebrow", "hero_title", "hero_subtitle")),
        tab(
            "Form",
            (
                "form_eyebrow", "form_title", "form_body", "form_email",
                ("field_name_label", "field_name_placeholder"),
                ("field_email_label", "field_email_placeholder"),
                ("field_company_label", "field_company_placeholder"),
                ("field_message_label", "field_message_placeholder"),
                "form_submit", "form_success",
            ),
        ),
        tab("Offices", ("offices_title", "offices_maps_label"), "Addresses are edited in the “Offices” tab."),
        tab("Media", ("media_title",), "People are edited in the “Media contacts” tab."),
    )


# ----------------------------------------------------------------------------- Legal


class LegalSectionInline(OrderedStackedInline):
    model = m.LegalSection
    fields = ("heading", "body")
    tab = False


@admin.register(m.LegalPage)
class LegalPageAdmin(SingletonAdmin):
    preview_path = "/legal"
    inlines = [LegalSectionInline]
    fieldsets = (("Header", {"fields": ("eyebrow", "title", "updated", "draft_note")}),)


class LegalDocumentSectionInline(OrderedStackedInline):
    model = m.LegalDocumentSection
    fields = ("heading", "body")
    tab = False


@admin.register(m.LegalDocument)
class LegalDocumentAdmin(SortableAdmin):
    list_display = ("title", "slug", "updated")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [LegalDocumentSectionInline]
    fields = ("title", "slug", "eyebrow", "updated", "intro", "disclaimer", "compliance_note")

    def get_preview_path(self, obj):
        return f"/legal/{obj.slug}" if obj else "/legal"


# ----------------------------------------------------------------------------- Listing-page settings


@admin.register(m.TeamPageSettings)
class TeamPageSettingsAdmin(SingletonAdmin):
    preview_path = "/team"
    fieldsets = (
        tab("Hero", ("hero_eyebrow", "hero_title", "hero_subtitle")),
        tab("Filters & search", ("search_placeholder", "no_results", "clear"), "Filter dropdown options live under Filters → Filter groups (page: Team)."),
        tab("Prior firms strip", ("prior_firms",)),
        tab("Why it matters", ("matters_eyebrow", "matters_statement", "matters_link_label", "matters_link_to")),
        tab("Profile page labels", ("profile_back", "profile_focus_label", "profile_connect_label", "profile_connect_value", "profile_firms_label")),
    )


class GlanceRowInline(OrderedTabularInline):
    model = m.GlanceRow
    fields = ("label", "col1", "col2", "col3")
    verbose_name_plural = "At a glance — rows"


@admin.register(m.SolutionsPageSettings)
class SolutionsPageSettingsAdmin(SingletonAdmin):
    preview_path = "/solutions"
    inlines = [GlanceRowInline]
    fieldsets = (
        tab("Hero", ("hero_eyebrow", "hero_title", "hero_subtitle")),
        tab("List", ("why_title", "why_body", "list_eyebrow", "explore_label"), "Solutions themselves are under Content → Solutions."),
        tab("In detail", ("detail_eyebrow", "detail_title")),
        tab("At a glance", ("glance_eyebrow", "glance_title", "glance_challenge_header", "glance_columns"), "Rows are edited in the “At a glance — rows” tab. Column 1/2/3 ticks correspond to the column headers in order."),
        tab("Detail page labels", ("overview_eyebrow", "deliver_eyebrow", "expect_eyebrow", "more_eyebrow", "more_title")),
    )


@admin.register(m.CaseStudiesPageSettings)
class CaseStudiesPageSettingsAdmin(SingletonAdmin):
    preview_path = "/case-studies"
    fieldsets = (
        tab("Hero", ("hero_eyebrow", "hero_title", "hero_subtitle")),
        tab("Controls", ("controls_categories", "controls_read_more", "controls_showing", "controls_load_more", "controls_clear", "controls_no_results", "page_size")),
        tab("Detail page labels", ("detail_back", "detail_tag", "detail_meta_labels", "detail_challenge", "detail_approach", "detail_results", "detail_more_eyebrow", "detail_more_title")),
    )


class PressContactInline(OrderedTabularInline):
    model = m.PressContact
    fields = ("label", "value")
    verbose_name_plural = "Follow — media contacts"


@admin.register(m.InsightsPageSettings)
class InsightsPageSettingsAdmin(SingletonAdmin):
    preview_path = "/insights"
    inlines = [PressContactInline]
    fieldsets = (
        tab("Hero", ("hero_eyebrow", "hero_title", "hero_subtitle")),
        tab("Controls", ("controls_categories", "controls_filter", "controls_read_more", "controls_showing", "controls_load_more", "controls_tag_primary", "controls_clear", "controls_no_results", "page_size")),
        tab("Follow", ("follow_statement", "follow_button", "follow_media_label"), "Contact lines are edited in the “Follow — media contacts” tab."),
        tab("Article page labels", ("article_back", "article_author", "article_meta_labels", "article_initials", "article_outline", "article_related")),
    )
