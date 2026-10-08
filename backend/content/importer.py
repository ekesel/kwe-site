"""
import_data(data) — load a data.json-shaped dict into the content models.

This is the inverse of assemble.build_content().  It is destructive by design:
it replaces all list rows so that the database reflects the file exactly.
"""

from django.db import transaction

from . import models as m
from .models import join_lines


def _set(obj, **fields):
    for k, v in fields.items():
        setattr(obj, k, v if v is not None else "")
    obj.save()
    return obj


def _replace(manager_or_qs, rows: list[dict], **extra):
    """Delete existing rows and create ``rows`` in order (with ``order`` set)."""
    manager_or_qs.all().delete()
    model = manager_or_qs.model
    for i, row in enumerate(rows):
        model.objects.create(order=i, **extra, **row)


def _is_external(url: str) -> bool:
    return bool(url) and not url.startswith("/media/")


# --------------------------------------------------------------------------- site


def import_site(d):
    s = m.SiteSettings.get_solo()
    site, nav, footer, cta, nf = d["site"], d["nav"], d["footer"], d["cta"], d["notFound"]
    _set(
        s,
        name=site["name"],
        tagline=site["tagline"],
        email=site["email"],
        linkedin=site["linkedin"],
        hero_video_url=site["heroVideo"] if _is_external(site["heroVideo"]) else s.hero_video_url,
        hero_poster_url=site["heroPoster"] if _is_external(site["heroPoster"]) else s.hero_poster_url,
        nav_cta_label=nav["cta"]["label"],
        nav_cta_to=nav["cta"]["to"],
        footer_disclosure=footer["disclosure"],
        footer_copyright=footer["copyright"],
        cta_eyebrow=cta["eyebrow"],
        cta_title=cta["title"],
        cta_body=cta["body"],
        cta_button_label=cta["button"]["label"],
        cta_button_to=cta["button"]["to"],
        not_found_code=nf["code"],
        not_found_title=nf["title"],
        not_found_body=nf["body"],
        not_found_button_label=nf["button"]["label"],
        not_found_button_to=nf["button"]["to"],
    )
    _replace(m.NavLink.objects, [{"label": x["label"], "to": x["to"]} for x in nav["links"]])
    m.FooterColumn.objects.all().delete()
    for i, col in enumerate(footer["columns"]):
        column = m.FooterColumn.objects.create(order=i, title=col["title"])
        for j, ln in enumerate(col["links"]):
            m.FooterLink.objects.create(
                column=column, order=j, label=ln["label"], to=ln.get("to", ""), href=ln.get("href", "")
            )


# --------------------------------------------------------------------------- home


def import_home(d):
    h = m.HomePage.get_solo()
    _set(
        h,
        hero_title=join_lines(d["hero"]["title"]),
        hero_scroll_cue=d["hero"]["scrollCue"],
        intro_eyebrow=d["intro"]["eyebrow"],
        intro_statement=d["intro"]["statement"],
        intro_link_label=d["intro"]["link"]["label"],
        intro_link_to=d["intro"]["link"]["to"],
        stats_eyebrow=d["stats"]["eyebrow"],
        stats_title=d["stats"]["title"],
        who_eyebrow=d["who"]["eyebrow"],
        who_title=d["who"]["title"],
        challenge_eyebrow=d["challenge"]["eyebrow"],
        challenge_title=d["challenge"]["title"],
        challenge_body=d["challenge"]["body"],
        diptych_traditional_label=d["diptych"]["traditional"]["label"],
        diptych_traditional_items=join_lines(d["diptych"]["traditional"]["items"]),
        diptych_kwe_label=d["diptych"]["kwe"]["label"],
        diptych_kwe_items=join_lines(d["diptych"]["kwe"]["items"]),
        what_eyebrow=d["whatWeDo"]["eyebrow"],
        what_title=d["whatWeDo"]["title"],
        what_body=d["whatWeDo"]["body"],
        cases_eyebrow=d["caseStudies"]["eyebrow"],
        cases_title=d["caseStudies"]["title"],
        cases_link_label=d["caseStudies"]["link"]["label"],
        approach_eyebrow=d["approach"]["eyebrow"],
        approach_title=d["approach"]["title"],
        approach_link_label=d["approach"]["link"]["label"],
        approach_link_to=d["approach"]["link"]["to"],
        team_eyebrow=d["team"]["eyebrow"],
        team_title=d["team"]["title"],
        team_link_label=d["team"]["link"]["label"],
        team_link_to=d["team"]["link"]["to"],
        testimonials_eyebrow=d["testimonials"]["eyebrow"],
        testimonials_title=d["testimonials"]["title"],
        trusted_eyebrow=d["testimonials"]["trustedEyebrow"],
        trusted_title=d["testimonials"]["trustedTitle"],
        logos=join_lines(d["testimonials"]["logos"]),
        insights_label=d["insights"]["label"],
        insights_title=d["insights"]["title"],
        insights_button_label=d["insights"]["button"]["label"],
        insights_button_to=d["insights"]["button"]["to"],
        insights_read_more=d["insights"]["readMore"],
    )
    _replace(h.stats, d["stats"]["items"], page=h)
    _replace(h.who_tiles, d["who"]["tiles"], page=h)
    _replace(h.challenge_items, d["challenge"]["items"], page=h)
    _replace(h.what_cards, d["whatWeDo"]["cards"], page=h)
    _replace(h.approach_steps, d["approach"]["steps"], page=h)
    _replace(h.testimonials, d["testimonials"]["items"], page=h)


# --------------------------------------------------------------------------- story


def import_story(d):
    s = m.StoryPage.get_solo()
    _set(
        s,
        hero_eyebrow=d["hero"]["eyebrow"],
        hero_title=d["hero"]["title"],
        hero_subtitle=join_lines(d["hero"]["subtitle"]),
        who_eyebrow=d["who"]["eyebrow"],
        who_title=d["who"]["title"],
        who_button_label=d["who"]["button"]["label"],
        who_button_to=d["who"]["button"]["to"],
        mission_eyebrow=d["mission"]["eyebrow"],
        mission_statement=d["mission"]["statement"],
        background_eyebrow=d["background"]["eyebrow"],
        background_title=d["background"]["title"],
        background_button_label=d["background"]["button"]["label"],
        background_button_to=d["background"]["button"]["to"],
        respond_eyebrow=d["respond"]["eyebrow"],
        respond_title=d["respond"]["title"],
        respond_lead=d["respond"]["lead"],
        respond_button_label=d["respond"]["button"]["label"],
        respond_button_to=d["respond"]["button"]["to"],
        vision_eyebrow=d["vision"]["eyebrow"],
        vision_index=d["vision"]["index"],
        vision_before=d["vision"]["before"],
        vision_highlight=d["vision"]["highlight"],
        vision_after=d["vision"]["after"],
        milestones_eyebrow=d["milestones"]["eyebrow"],
        milestones_title=d["milestones"]["title"],
        teaser_title=d["teamTeaser"]["title"],
        teaser_link_label=d["teamTeaser"]["link"]["label"],
        teaser_link_to=d["teamTeaser"]["link"]["to"],
    )
    _replace(s.anchors, d["hero"]["anchors"], page=s)
    _replace(s.pillars, d["who"]["pillars"], page=s)
    _replace(s.stats, d["who"]["stats"], page=s)
    _replace(s.background_rows, d["background"]["rows"], page=s)
    _replace(s.respond_steps, d["respond"]["steps"], page=s)
    _replace(
        s.milestones,
        [{"year": x["year"], "text": x["text"], "current": bool(x.get("current"))} for x in d["milestones"]["items"]],
        page=s,
    )


# --------------------------------------------------------------------------- filters


def _import_filter_groups(page, groups: list[dict]):
    """groups: list of {kind, label, key, options:[{label,value}]}"""
    m.FilterGroup.objects.filter(page=page).delete()
    for i, g in enumerate(groups):
        group = m.FilterGroup.objects.create(
            page=page, kind=g["kind"], label=g.get("label", ""), key=g.get("key", ""), order=i
        )
        for j, o in enumerate(g["options"]):
            m.FilterOption.objects.create(group=group, order=j, label=o["label"], value=o.get("value") or "")


def _dropdowns(filters):
    return [
        {"kind": "dropdown", "label": f["label"], "key": f["key"], "options": [{"label": o} for o in f["options"]]}
        for f in filters
    ]


# --------------------------------------------------------------------------- team


def import_team(d):
    t = m.TeamPageSettings.get_solo()
    _set(
        t,
        hero_eyebrow=d["hero"]["eyebrow"],
        hero_title=d["hero"]["title"],
        hero_anchor_label=d["hero"]["anchor"]["label"],
        hero_anchor_href=d["hero"]["anchor"]["href"],
        hero_cta_label=d["hero"]["cta"]["label"],
        hero_cta_to=d["hero"]["cta"]["to"],
        search_placeholder=d["searchPlaceholder"],
        profile_back=d["profile"]["back"],
        profile_focus_label=d["profile"]["focusLabel"],
        profile_connect_label=d["profile"]["connectLabel"],
        profile_connect_value=d["profile"]["connectValue"],
        profile_firms_label=d["profile"]["firmsLabel"],
        prior_firms=join_lines(d["priorFirms"]),
        matters_eyebrow=d["matters"]["eyebrow"],
        matters_statement=d["matters"]["statement"],
        matters_link_label=d["matters"]["link"]["label"],
        matters_link_to=d["matters"]["link"]["to"],
        no_results=d["noResults"],
        clear=d["clear"],
    )
    _import_filter_groups("team", _dropdowns(d["filters"]))
    m.TeamMember.objects.all().delete()
    for i, x in enumerate(d["members"]):
        m.TeamMember.objects.create(
            order=i,
            slug=x["slug"],
            name=x["name"],
            role=x["role"],
            focus=x["focus"],
            firms=join_lines(x["firms"]),
            image_url=x["image"] if _is_external(x["image"]) else "",
            span=x["span"],
            bio=join_lines(x["bio"]),
            team=x["team"],
            region=x["region"],
        )


# --------------------------------------------------------------------------- process


def import_process(d):
    p = m.ProcessPage.get_solo()
    _set(
        p,
        hero_eyebrow=d["hero"]["eyebrow"],
        hero_title=d["hero"]["title"],
        hero_subtitle=d["hero"]["subtitle"],
        hero_anchors=join_lines(d["hero"]["anchors"]),
        stepper_eyebrow=d["stepper"]["eyebrow"],
        stepper_next_label=d["stepper"]["nextLabel"],
        why_eyebrow=d["why"]["eyebrow"],
        why_title=d["why"]["title"],
        timeline_figure=d["timeline"]["figure"],
        timeline_text=d["timeline"]["text"],
        timeline_nodes=join_lines(d["timeline"]["nodes"]),
        faq_eyebrow=d["faq"]["eyebrow"],
        faq_title=d["faq"]["title"],
    )
    _replace(p.steps, d["stepper"]["steps"], page=p)
    _replace(p.why_cards, d["why"]["cards"], page=p)
    _replace(p.faqs, d["faq"]["items"], page=p)


# --------------------------------------------------------------------------- solutions


def import_solutions(d):
    s = m.SolutionsPageSettings.get_solo()
    _set(
        s,
        hero_eyebrow=d["hero"]["eyebrow"],
        hero_title=d["hero"]["title"],
        hero_subtitle=d["hero"]["subtitle"],
        list_eyebrow=d["listEyebrow"],
        detail_eyebrow=d["detailEyebrow"],
        glance_eyebrow=d["glance"]["eyebrow"],
        glance_title=d["glance"]["title"],
        glance_challenge_header=d["glance"]["challengeHeader"],
        glance_columns=join_lines(d["glance"]["columns"]),
        overview_eyebrow=d["overviewEyebrow"],
        deliver_eyebrow=d["deliverEyebrow"],
        expect_eyebrow=d["expectEyebrow"],
        more_eyebrow=d["moreEyebrow"],
        more_title=d["moreTitle"],
        scroll_cue=d["scrollCue"],
        header_title=d["header"]["title"],
        header_body=d["header"]["body"],
        detail_title=d["detailTitle"],
        explore_label=d["exploreLabel"],
    )
    _replace(
        s.glance_rows,
        [
            {"label": r["label"], "col1": r["cells"][0], "col2": r["cells"][1], "col3": r["cells"][2]}
            for r in d["glance"]["rows"]
        ],
        page=s,
    )
    m.Solution.objects.all().delete()
    for i, x in enumerate(d["items"]):
        sol = m.Solution.objects.create(
            order=i,
            slug=x["slug"],
            n=x["n"],
            category=x["category"],
            title=x["title"],
            tagline=x["tagline"],
            subtitle=x["subtitle"],
            lead=x["lead"],
            card_body=x["cardBody"],
            tint=x["tint"],
            overview_before=x["overview"]["before"],
            overview_highlight=x["overview"]["highlight"],
            overview_after=x["overview"]["after"],
            image_url=x["image"] if _is_external(x["image"]) else "",
            highlights=join_lines(x["highlights"]),
            tag=x["tag"],
        )
        _replace(sol.deliverables, x["deliverables"], solution=sol)
        _replace(sol.expectations, x["expect"], solution=sol)


# --------------------------------------------------------------------------- case studies


def import_case_studies(d):
    c = m.CaseStudiesPageSettings.get_solo()
    ctl, det, per, tr = d["controls"], d["detail"], d["perspectives"], d["trusted"]
    _set(
        c,
        hero_eyebrow=d["hero"]["eyebrow"],
        hero_title=d["hero"]["title"],
        hero_subtitle=d["hero"]["subtitle"],
        hero_scroll_cue=d["hero"]["scrollCue"],
        controls_categories=ctl["categories"],
        controls_filter=ctl["filter"],
        controls_read_more=ctl["readMore"],
        controls_showing=ctl["showing"],
        controls_load_more=ctl["loadMore"],
        controls_clear=ctl["clear"],
        controls_no_results=ctl["noResults"],
        page_size=ctl["pageSize"],
        detail_back=det["back"],
        detail_tag=det["tag"],
        detail_meta_labels=join_lines(det["meta"]),
        detail_challenge=det["challenge"],
        detail_approach=det["approach"],
        detail_results=det["results"],
        detail_more_eyebrow=det["moreEyebrow"],
        detail_more_title=det["moreTitle"],
        perspectives_eyebrow=per["eyebrow"],
        perspectives_title=per["title"],
        perspectives_note=per["note"],
        perspectives_compliance=per["compliance"],
        trusted_eyebrow=tr["eyebrow"],
        trusted_logos=join_lines(tr["logos"]),
        trusted_note=tr["note"],
    )
    _replace(c.perspectives, per["items"], page=c)
    _import_filter_groups(
        "caseStudies",
        _dropdowns(d["hero"]["filters"])
        + [{"kind": "categories", "label": ctl["categories"], "options": [{"label": o} for o in ctl["categoriesOptions"]]}],
    )
    m.CaseStudy.objects.all().delete()
    for i, x in enumerate(d["items"]):
        q = x.get("quote") or {}
        cs = m.CaseStudy.objects.create(
            order=i,
            slug=x["slug"],
            key=x["key"],
            category=x["category"],
            tags=join_lines(x["tags"]),
            image_url=x["image"] if _is_external(x["image"]) else "",
            card_title=x["cardTitle"],
            title=x["title"],
            subtitle=x["subtitle"],
            meta=join_lines(x["meta"]),
            challenge=x["challenge"],
            outcome=x["outcome"],
            quote_text=q.get("text", ""),
            quote_attribution=q.get("attribution", ""),
            strategy=x["strategy"],
            fund_type=x["fundType"],
            region=x["region"],
            category_group=x["categoryGroup"],
        )
        _replace(cs.approach_steps, x["approach"], case_study=cs)
        _replace(cs.results, x["results"], case_study=cs)
    m.ExtraCard.objects.filter(kind="caseStudies").delete()
    for i, x in enumerate(d["extraCards"]):
        m.ExtraCard.objects.create(
            kind="caseStudies",
            order=i,
            category=x["category"],
            title=x["title"],
            tags=join_lines(x["tags"]),
            image_url=x["image"] if _is_external(x["image"]) else "",
            strategy=x["strategy"],
            fund_type=x["fundType"],
            region=x["region"],
            category_group=x["categoryGroup"],
        )


# --------------------------------------------------------------------------- insights


def import_insights(d):
    n = m.InsightsPageSettings.get_solo()
    ctl, fo, art = d["controls"], d["follow"], d["article"]
    _set(
        n,
        hero_eyebrow=d["hero"]["eyebrow"],
        hero_title=d["hero"]["title"],
        hero_scroll_cue=d["hero"]["scrollCue"],
        controls_categories=ctl["categories"],
        controls_filter=ctl["filter"],
        controls_read_more=ctl["readMore"],
        controls_showing=ctl["showing"],
        controls_load_more=ctl["loadMore"],
        controls_tag_primary=ctl["tagPrimary"],
        controls_clear=ctl["clear"],
        controls_no_results=ctl["noResults"],
        page_size=ctl["pageSize"],
        follow_statement=fo["statement"],
        follow_button=fo["button"],
        follow_media_label=fo["mediaLabel"],
        article_back=art["back"],
        article_author=art["author"],
        article_initials=art["initials"],
        article_toc=art["toc"],
        article_related=art["related"],
    )
    _replace(n.press_contacts, fo["contacts"], page=n)
    _import_filter_groups(
        "insights",
        [
            {"kind": "chips", "label": "Topics", "options": [{"label": ch["label"], "value": ch["topic"]} for ch in d["hero"]["chips"]]},
            {"kind": "categories", "label": ctl["categories"], "options": [{"label": o} for o in ctl["categoriesOptions"]]},
            {"kind": "readtime", "label": ctl["filterOptions"]["label"], "options": [{"label": o} for o in ctl["filterOptions"]["options"]]},
        ],
    )
    m.Insight.objects.all().delete()
    for i, x in enumerate(d["items"]):
        ins = m.Insight.objects.create(
            order=i,
            slug=x["slug"],
            category=x["category"],
            date=x["date"],
            read=x["read"],
            image_url=x["image"] if _is_external(x["image"]) else "",
            title=x["title"],
            subtitle=x["subtitle"],
            toc=join_lines(x["toc"]),
            h2=x["h2"],
            p1=x["p1"],
            p2=x["p2"],
            quote=x["quote"],
            p3=x["p3"],
        )
        _replace(ins.stats, x["stats"], insight=ins)
    m.ExtraCard.objects.filter(kind="insights").delete()
    for i, x in enumerate(d["extraCards"]):
        m.ExtraCard.objects.create(
            kind="insights",
            order=i,
            category=x["category"],
            title=x["title"],
            image_url=x["image"] if _is_external(x["image"]) else "",
            date=x["date"],
            read=x["read"],
        )


# --------------------------------------------------------------------------- contact / legal


def import_contact(d):
    c = m.ContactPage.get_solo()
    f, flds = d["form"], d["form"]["fields"]
    _set(
        c,
        hero_eyebrow=d["hero"]["eyebrow"],
        hero_title=d["hero"]["title"],
        hero_subtitle=d["hero"]["subtitle"],
        hero_email=d["hero"]["email"],
        hero_linkedin=d["hero"]["linkedin"],
        form_eyebrow=f["eyebrow"],
        form_title=f["title"],
        form_body=f["body"],
        form_email=f["email"],
        field_name_label=flds["name"]["label"],
        field_name_placeholder=flds["name"]["placeholder"],
        field_email_label=flds["email"]["label"],
        field_email_placeholder=flds["email"]["placeholder"],
        field_company_label=flds["company"]["label"],
        field_company_placeholder=flds["company"]["placeholder"],
        field_message_label=flds["message"]["label"],
        field_message_placeholder=flds["message"]["placeholder"],
        form_submit=f["submit"],
        form_success=f["success"],
        offices_title=d["offices"]["title"],
        offices_maps_label=d["offices"]["mapsLabel"],
        media_title=d["media"]["title"],
    )
    _replace(
        c.offices,
        [
            {"name": o["name"], "address": join_lines(o["address"]), "tel": o["tel"], "email": o["email"], "maps": o["maps"]}
            for o in d["offices"]["items"]
        ],
        page=c,
    )
    _replace(c.media_contacts, d["media"]["items"], page=c)


def import_legal(d):
    lg = m.LegalPage.get_solo()
    _set(lg, eyebrow=d["eyebrow"], title=d["title"], updated=d["updated"])
    _replace(lg.sections, d["sections"], page=lg)


# --------------------------------------------------------------------------- root


@transaction.atomic
def import_data(data: dict):
    import_site(data)
    import_home(data["home"])
    import_story(data["story"])
    import_team(data["team"])
    import_process(data["process"])
    import_solutions(data["solutions"])
    import_case_studies(data["caseStudies"])
    import_insights(data["insights"])
    import_contact(data["contact"])
    import_legal(data["legal"])


def is_empty() -> bool:
    """True when no content has been imported yet (fresh database)."""
    return not (m.NavLink.objects.exists() or m.TeamMember.objects.exists() or m.Solution.objects.exists())
