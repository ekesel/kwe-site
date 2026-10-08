"""
build_content() — assemble the public JSON in EXACTLY the shape of frontend/src/data.json.

Key order, nesting and list ordering mirror the original file so the frontend's data
access never has to change.  The round-trip test (content/tests/test_roundtrip.py)
imports seed/data.json and asserts deep equality against this output.
"""

from . import models as m
from .models import lines


def _link(label, to):
    return {"label": label, "to": to}


# --------------------------------------------------------------------------- site


def site_section(s: m.SiteSettings):
    return {
        "name": s.name,
        "tagline": s.tagline,
        "email": s.email,
        "linkedin": s.linkedin,
        "heroVideo": s.hero_video_src,
        "heroPoster": s.hero_poster_src,
    }


def nav_section(s: m.SiteSettings):
    return {
        "links": [_link(n.label, n.to) for n in m.NavLink.objects.all()],
        "cta": _link(s.nav_cta_label, s.nav_cta_to),
    }


def _footer_link(ln: m.FooterLink):
    if ln.to:
        return {"label": ln.label, "to": ln.to}
    return {"label": ln.label, "href": ln.href}


def footer_section(s: m.SiteSettings):
    return {
        "columns": [
            {"title": col.title, "links": [_footer_link(ln) for ln in col.links.all()]}
            for col in m.FooterColumn.objects.prefetch_related("links")
        ],
        "disclosure": s.footer_disclosure,
        "copyright": s.footer_copyright,
    }


def cta_section(s: m.SiteSettings):
    return {
        "eyebrow": s.cta_eyebrow,
        "title": s.cta_title,
        "body": s.cta_body,
        "button": _link(s.cta_button_label, s.cta_button_to),
    }


def not_found_section(s: m.SiteSettings):
    return {
        "code": s.not_found_code,
        "title": s.not_found_title,
        "body": s.not_found_body,
        "button": _link(s.not_found_button_label, s.not_found_button_to),
    }


# --------------------------------------------------------------------------- home


def home_section():
    h = m.HomePage.get_solo()
    return {
        "hero": {"title": lines(h.hero_title), "scrollCue": h.hero_scroll_cue},
        "intro": {
            "eyebrow": h.intro_eyebrow,
            "statement": h.intro_statement,
            "link": _link(h.intro_link_label, h.intro_link_to),
        },
        "stats": {
            "eyebrow": h.stats_eyebrow,
            "title": h.stats_title,
            "items": [{"figure": s.figure, "label": s.label, "tone": s.tone} for s in h.stats.all()],
        },
        "who": {
            "eyebrow": h.who_eyebrow,
            "title": h.who_title,
            "tiles": [{"label": t.label, "tone": t.tone} for t in h.who_tiles.all()],
        },
        "challenge": {
            "eyebrow": h.challenge_eyebrow,
            "title": h.challenge_title,
            "body": h.challenge_body,
            "items": [{"icon": i.icon, "title": i.title, "body": i.body} for i in h.challenge_items.all()],
        },
        "diptych": {
            "traditional": {"label": h.diptych_traditional_label, "items": lines(h.diptych_traditional_items)},
            "kwe": {"label": h.diptych_kwe_label, "items": lines(h.diptych_kwe_items)},
        },
        "whatWeDo": {
            "eyebrow": h.what_eyebrow,
            "title": h.what_title,
            "body": h.what_body,
            "cards": [
                {"n": c.n, "title": c.title, "subtitle": c.subtitle, "body": c.body, "to": c.to}
                for c in h.what_cards.all()
            ],
        },
        "caseStudies": {
            "eyebrow": h.cases_eyebrow,
            "title": h.cases_title,
            "link": {"label": h.cases_link_label},
        },
        "approach": {
            "eyebrow": h.approach_eyebrow,
            "title": h.approach_title,
            "steps": [
                {"n": s.n, "title": s.title, "body": s.body, "tone": s.tone} for s in h.approach_steps.all()
            ],
            "link": _link(h.approach_link_label, h.approach_link_to),
        },
        "team": {
            "eyebrow": h.team_eyebrow,
            "title": h.team_title,
            "link": _link(h.team_link_label, h.team_link_to),
        },
        "testimonials": {
            "eyebrow": h.testimonials_eyebrow,
            "title": h.testimonials_title,
            "items": [
                {"firm": t.firm, "quote": t.quote, "name": t.name, "role": t.role, "tone": t.tone}
                for t in h.testimonials.all()
            ],
            "trustedEyebrow": h.trusted_eyebrow,
            "trustedTitle": h.trusted_title,
            "logos": lines(h.logos),
        },
        "insights": {
            "label": h.insights_label,
            "title": h.insights_title,
            "button": _link(h.insights_button_label, h.insights_button_to),
            "readMore": h.insights_read_more,
        },
    }


# --------------------------------------------------------------------------- story


def story_section():
    s = m.StoryPage.get_solo()
    milestones = []
    for ms in s.milestones.all():
        item = {"year": ms.year, "text": ms.text}
        if ms.current:
            item["current"] = True
        milestones.append(item)
    return {
        "hero": {
            "eyebrow": s.hero_eyebrow,
            "title": s.hero_title,
            "subtitle": lines(s.hero_subtitle),
            "anchors": [{"label": a.label, "href": a.href} for a in s.anchors.all()],
        },
        "who": {
            "eyebrow": s.who_eyebrow,
            "title": s.who_title,
            "pillars": [{"title": p.title, "body": p.body, "accent": p.accent} for p in s.pillars.all()],
            "stats": [{"figure": st.figure, "label": st.label} for st in s.stats.all()],
            "button": _link(s.who_button_label, s.who_button_to),
        },
        "mission": {"eyebrow": s.mission_eyebrow, "statement": s.mission_statement},
        "background": {
            "eyebrow": s.background_eyebrow,
            "title": s.background_title,
            "rows": [{"n": r.n, "label": r.label, "body": r.body} for r in s.background_rows.all()],
            "button": _link(s.background_button_label, s.background_button_to),
        },
        "respond": {
            "eyebrow": s.respond_eyebrow,
            "title": s.respond_title,
            "lead": s.respond_lead,
            "steps": [{"n": st.n, "title": st.title, "body": st.body} for st in s.respond_steps.all()],
            "button": _link(s.respond_button_label, s.respond_button_to),
        },
        "vision": {
            "eyebrow": s.vision_eyebrow,
            "index": s.vision_index,
            "before": s.vision_before,
            "highlight": s.vision_highlight,
            "after": s.vision_after,
        },
        "milestones": {"eyebrow": s.milestones_eyebrow, "title": s.milestones_title, "items": milestones},
        "teamTeaser": {"title": s.teaser_title, "link": _link(s.teaser_link_label, s.teaser_link_to)},
    }


# --------------------------------------------------------------------------- filters


def _groups(page, kind):
    return m.FilterGroup.objects.filter(page=page, kind=kind).prefetch_related("options")


def dropdown_filters(page):
    return [
        {"label": g.label, "key": g.key, "options": [o.label for o in g.options.all()]}
        for g in _groups(page, "dropdown")
    ]


def category_options(page):
    g = _groups(page, "categories").first()
    return [o.label for o in g.options.all()] if g else []


# --------------------------------------------------------------------------- team


def team_member(t: m.TeamMember):
    return {
        "slug": t.slug,
        "name": t.name,
        "role": t.role,
        "focus": t.focus,
        "firms": lines(t.firms),
        "image": t.image_src,
        "span": t.span,
        "bio": lines(t.bio),
        "team": t.team,
        "region": t.region,
    }


def team_section():
    t = m.TeamPageSettings.get_solo()
    return {
        "hero": {
            "eyebrow": t.hero_eyebrow,
            "title": t.hero_title,
            "anchor": {"label": t.hero_anchor_label, "href": t.hero_anchor_href},
            "cta": _link(t.hero_cta_label, t.hero_cta_to),
        },
        "filters": dropdown_filters("team"),
        "searchPlaceholder": t.search_placeholder,
        "members": [team_member(x) for x in m.TeamMember.objects.all()],
        "profile": {
            "back": t.profile_back,
            "focusLabel": t.profile_focus_label,
            "connectLabel": t.profile_connect_label,
            "connectValue": t.profile_connect_value,
            "firmsLabel": t.profile_firms_label,
        },
        "priorFirms": lines(t.prior_firms),
        "matters": {
            "eyebrow": t.matters_eyebrow,
            "statement": t.matters_statement,
            "link": _link(t.matters_link_label, t.matters_link_to),
        },
        "noResults": t.no_results,
        "clear": t.clear,
    }


# --------------------------------------------------------------------------- process


def process_section():
    p = m.ProcessPage.get_solo()
    return {
        "hero": {
            "eyebrow": p.hero_eyebrow,
            "title": p.hero_title,
            "subtitle": p.hero_subtitle,
            "anchors": lines(p.hero_anchors),
        },
        "stepper": {
            "eyebrow": p.stepper_eyebrow,
            "nextLabel": p.stepper_next_label,
            "steps": [
                {"n": s.n, "short": s.short, "title": s.title, "lead": s.lead, "body": s.body} for s in p.steps.all()
            ],
        },
        "why": {
            "eyebrow": p.why_eyebrow,
            "title": p.why_title,
            "cards": [{"icon": c.icon, "tone": c.tone, "title": c.title, "body": c.body} for c in p.why_cards.all()],
        },
        "timeline": {"figure": p.timeline_figure, "text": p.timeline_text, "nodes": lines(p.timeline_nodes)},
        "faq": {
            "eyebrow": p.faq_eyebrow,
            "title": p.faq_title,
            "items": [{"q": f.q, "a": f.a} for f in p.faqs.all()],
        },
    }


# --------------------------------------------------------------------------- solutions


def solution_item(s: m.Solution):
    return {
        "slug": s.slug,
        "n": s.n,
        "category": s.category,
        "title": s.title,
        "tagline": s.tagline,
        "subtitle": s.subtitle,
        "lead": s.lead,
        "cardBody": s.card_body,
        "tint": s.tint,
        "overview": {"before": s.overview_before, "highlight": s.overview_highlight, "after": s.overview_after},
        "deliverables": [{"icon": d.icon, "title": d.title} for d in s.deliverables.all()],
        "expect": [{"icon": e.icon, "title": e.title, "body": e.body} for e in s.expectations.all()],
        "image": s.image_src,
        "highlights": lines(s.highlights),
        "tag": s.tag,
    }


def solutions_section():
    s = m.SolutionsPageSettings.get_solo()
    return {
        "hero": {"eyebrow": s.hero_eyebrow, "title": s.hero_title, "subtitle": s.hero_subtitle},
        "listEyebrow": s.list_eyebrow,
        "detailEyebrow": s.detail_eyebrow,
        "glance": {
            "eyebrow": s.glance_eyebrow,
            "title": s.glance_title,
            "rows": [{"label": r.label, "cells": r.cells} for r in s.glance_rows.all()],
            "challengeHeader": s.glance_challenge_header,
            "columns": lines(s.glance_columns),
        },
        "overviewEyebrow": s.overview_eyebrow,
        "deliverEyebrow": s.deliver_eyebrow,
        "expectEyebrow": s.expect_eyebrow,
        "moreEyebrow": s.more_eyebrow,
        "moreTitle": s.more_title,
        "scrollCue": s.scroll_cue,
        "items": [
            solution_item(x) for x in m.Solution.objects.prefetch_related("deliverables", "expectations")
        ],
        "header": {"title": s.header_title, "body": s.header_body},
        "detailTitle": s.detail_title,
        "exploreLabel": s.explore_label,
    }


# --------------------------------------------------------------------------- case studies


def case_study_item(c: m.CaseStudy):
    return {
        "slug": c.slug,
        "key": c.key,
        "category": c.category,
        "tags": lines(c.tags),
        "image": c.image_src,
        "cardTitle": c.card_title,
        "title": c.title,
        "subtitle": c.subtitle,
        "meta": lines(c.meta),
        "challenge": c.challenge,
        "approach": [{"title": a.title, "body": a.body} for a in c.approach_steps.all()],
        "results": [{"big": r.big, "small": r.small, "label": r.label} for r in c.results.all()],
        "outcome": c.outcome,
        "quote": {"text": c.quote_text, "attribution": c.quote_attribution} if c.quote_text else None,
        "strategy": c.strategy,
        "fundType": c.fund_type,
        "region": c.region,
        "categoryGroup": c.category_group,
    }


def case_extra_card(e: m.ExtraCard):
    return {
        "category": e.category,
        "title": e.title,
        "tags": lines(e.tags),
        "image": e.image_src,
        "strategy": e.strategy,
        "fundType": e.fund_type,
        "region": e.region,
        "categoryGroup": e.category_group,
    }


def case_studies_section():
    c = m.CaseStudiesPageSettings.get_solo()
    return {
        "hero": {
            "eyebrow": c.hero_eyebrow,
            "title": c.hero_title,
            "subtitle": c.hero_subtitle,
            "filters": dropdown_filters("caseStudies"),
            "scrollCue": c.hero_scroll_cue,
        },
        "controls": {
            "categories": c.controls_categories,
            "filter": c.controls_filter,
            "readMore": c.controls_read_more,
            "showing": c.controls_showing,
            "loadMore": c.controls_load_more,
            "categoriesOptions": category_options("caseStudies"),
            "clear": c.controls_clear,
            "noResults": c.controls_no_results,
            "pageSize": c.page_size,
        },
        "detail": {
            "back": c.detail_back,
            "tag": c.detail_tag,
            "meta": lines(c.detail_meta_labels),
            "challenge": c.detail_challenge,
            "approach": c.detail_approach,
            "results": c.detail_results,
            "moreEyebrow": c.detail_more_eyebrow,
            "moreTitle": c.detail_more_title,
        },
        "items": [
            case_study_item(x) for x in m.CaseStudy.objects.prefetch_related("approach_steps", "results")
        ],
        "extraCards": [case_extra_card(e) for e in m.ExtraCard.objects.filter(kind="caseStudies")],
        "perspectives": {
            "eyebrow": c.perspectives_eyebrow,
            "title": c.perspectives_title,
            "note": c.perspectives_note,
            "items": [{"quote": p.quote, "name": p.name, "firm": p.firm} for p in c.perspectives.all()],
            "compliance": c.perspectives_compliance,
        },
        "trusted": {"eyebrow": c.trusted_eyebrow, "logos": lines(c.trusted_logos), "note": c.trusted_note},
    }


# --------------------------------------------------------------------------- insights


def insight_item(i: m.Insight):
    return {
        "slug": i.slug,
        "category": i.category,
        "date": i.date,
        "read": i.read,
        "image": i.image_src,
        "title": i.title,
        "subtitle": i.subtitle,
        "toc": lines(i.toc),
        "h2": i.h2,
        "p1": i.p1,
        "stats": [{"big": s.big, "unit": s.unit, "label": s.label} for s in i.stats.all()],
        "p2": i.p2,
        "quote": i.quote,
        "p3": i.p3,
    }


def insight_extra_card(e: m.ExtraCard):
    return {"category": e.category, "title": e.title, "image": e.image_src, "date": e.date, "read": e.read}


def insights_section():
    n = m.InsightsPageSettings.get_solo()
    chips_group = _groups("insights", "chips").first()
    readtime_group = _groups("insights", "readtime").first()
    return {
        "hero": {
            "eyebrow": n.hero_eyebrow,
            "title": n.hero_title,
            "chips": [
                {"label": o.label, "topic": o.value or None} for o in (chips_group.options.all() if chips_group else [])
            ],
            "scrollCue": n.hero_scroll_cue,
        },
        "controls": {
            "categories": n.controls_categories,
            "filter": n.controls_filter,
            "readMore": n.controls_read_more,
            "showing": n.controls_showing,
            "loadMore": n.controls_load_more,
            "tagPrimary": n.controls_tag_primary,
            "categoriesOptions": category_options("insights"),
            "clear": n.controls_clear,
            "noResults": n.controls_no_results,
            "pageSize": n.page_size,
            "filterOptions": {
                "label": readtime_group.label if readtime_group else "",
                "options": [o.label for o in readtime_group.options.all()] if readtime_group else [],
            },
        },
        "follow": {
            "statement": n.follow_statement,
            "button": n.follow_button,
            "mediaLabel": n.follow_media_label,
            "contacts": [{"label": c.label, "value": c.value} for c in n.press_contacts.all()],
        },
        "article": {
            "back": n.article_back,
            "author": n.article_author,
            "initials": n.article_initials,
            "toc": n.article_toc,
            "related": n.article_related,
        },
        "items": [insight_item(x) for x in m.Insight.objects.prefetch_related("stats")],
        "extraCards": [insight_extra_card(e) for e in m.ExtraCard.objects.filter(kind="insights")],
    }


# --------------------------------------------------------------------------- contact / legal


def contact_section():
    c = m.ContactPage.get_solo()
    return {
        "hero": {
            "eyebrow": c.hero_eyebrow,
            "title": c.hero_title,
            "subtitle": c.hero_subtitle,
            "email": c.hero_email,
            "linkedin": c.hero_linkedin,
        },
        "form": {
            "eyebrow": c.form_eyebrow,
            "title": c.form_title,
            "body": c.form_body,
            "email": c.form_email,
            "fields": {
                "name": {"label": c.field_name_label, "placeholder": c.field_name_placeholder},
                "email": {"label": c.field_email_label, "placeholder": c.field_email_placeholder},
                "company": {"label": c.field_company_label, "placeholder": c.field_company_placeholder},
                "message": {"label": c.field_message_label, "placeholder": c.field_message_placeholder},
            },
            "submit": c.form_submit,
            "success": c.form_success,
        },
        "offices": {
            "title": c.offices_title,
            "mapsLabel": c.offices_maps_label,
            "items": [
                {"name": o.name, "address": lines(o.address), "tel": o.tel, "email": o.email, "maps": o.maps}
                for o in c.offices.all()
            ],
        },
        "media": {
            "title": c.media_title,
            "items": [
                {"name": p.name, "role": p.role, "tel": p.tel, "email": p.email} for p in c.media_contacts.all()
            ],
        },
    }


def legal_section():
    lg = m.LegalPage.get_solo()
    return {
        "eyebrow": lg.eyebrow,
        "title": lg.title,
        "updated": lg.updated,
        "sections": [{"heading": s.heading, "body": s.body} for s in lg.sections.all()],
    }


# --------------------------------------------------------------------------- root


def build_content() -> dict:
    s = m.SiteSettings.get_solo()
    return {
        "site": site_section(s),
        "nav": nav_section(s),
        "footer": footer_section(s),
        "cta": cta_section(s),
        "home": home_section(),
        "story": story_section(),
        "team": team_section(),
        "process": process_section(),
        "solutions": solutions_section(),
        "caseStudies": case_studies_section(),
        "insights": insights_section(),
        "contact": contact_section(),
        "legal": legal_section(),
        "notFound": not_found_section(s),
    }
