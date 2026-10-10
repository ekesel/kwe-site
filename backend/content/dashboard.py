"""Admin dashboard: quick links + "last updated" cards (UNFOLD["DASHBOARD_CALLBACK"])."""

from django.apps import apps
from django.urls import reverse

from . import models as m
from .admin.base import site_url

QUICK_LINKS = [
    ("Home page", "home", "content_homepage_changelist", "/"),
    ("Story", "auto_stories", "content_storypage_changelist", "/story"),
    ("Process", "route", "content_processpage_changelist", "/process"),
    ("Team members", "person", "content_teammember_changelist", "/team"),
    ("Solutions", "category", "content_solution_changelist", "/solutions"),
    ("Case studies", "cases", "content_casestudy_changelist", "/case-studies"),
    ("Insights", "article", "content_insight_changelist", "/insights"),
    ("Contact page", "mail", "content_contactpage_changelist", "/contact"),
    ("Site settings", "settings", "content_sitesettings_changelist", "/"),
    ("Media library", "perm_media", "content_mediaasset_changelist", None),
]

# Which historical models feed each "section" card.
SECTIONS = {
    "Site & navigation": [m.SiteSettings, m.NavLink, m.FooterColumn, m.FooterLink],
    "Home": [m.HomePage, m.HomeStat, m.HomeWhoTile, m.HomeChallengeItem, m.HomeWhatCard, m.HomeComparisonRow, m.HomeTestimonial, m.HomeTrustedLogo],
    "Story": [m.StoryPage, m.StoryPillar, m.StoryStat, m.StoryBackgroundRow, m.StoryRespondStep, m.StoryMilestone],
    "Process": [m.ProcessPage, m.ProcessStep, m.ProcessWhyCard, m.ProcessFaq],
    "Team": [m.TeamPageSettings, m.TeamMember],
    "Solutions": [m.SolutionsPageSettings, m.GlanceRow, m.Solution, m.SolutionDeliverable, m.SolutionExpectation],
    "Case studies": [m.CaseStudiesPageSettings, m.CaseStudy, m.CaseStudyApproachStep],
    "Insights": [m.InsightsPageSettings, m.PressContact, m.Insight],
    "Contact & legal": [m.ContactPage, m.Office, m.MediaContact, m.LegalPage, m.LegalSection, m.LegalDocument],
    "Filters": [m.FilterGroup, m.FilterOption],
}


def _latest(models):
    best = None
    for model in models:
        hist = getattr(model, "history", None)
        if hist is None:
            continue
        row = hist.model.objects.order_by("-history_date").values("history_date", "history_user__username", "history_type").first()
        if row and (best is None or row["history_date"] > best["history_date"]):
            best = row
    return best


def dashboard_callback(request, context):
    links = []
    for title, icon, urlname, path in QUICK_LINKS:
        links.append(
            {
                "title": title,
                "icon": icon,
                "link": reverse(f"admin:{urlname}"),
                "preview": site_url(path) if path else None,
            }
        )
    updates = []
    for name, models in SECTIONS.items():
        row = _latest(models)
        updates.append(
            {
                "title": name,
                "when": row["history_date"] if row else None,
                "who": (row["history_user__username"] if row else None) or "—",
            }
        )
    counts = {
        "team": m.TeamMember.objects.count(),
        "solutions": m.Solution.objects.count(),
        "case_studies": m.CaseStudy.objects.count(),
        "insights": m.Insight.objects.count(),
        "media": m.MediaAsset.objects.count(),
    }
    context.update(
        {
            "quick_links": links,
            "section_updates": updates,
            "counts": counts,
            "site_view_url": site_url(),
            "api_url": "/api/content/",
        }
    )
    return context


__all__ = ["dashboard_callback", "apps"]
