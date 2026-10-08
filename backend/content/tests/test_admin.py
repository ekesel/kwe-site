"""Every registered content model's admin pages load for a logged-in superuser."""

import pytest
from django.contrib import admin
from django.urls import reverse

from content import models as m
from content.models import SINGLETONS


def _content_models():
    return [model for model in admin.site._registry if model._meta.app_label == "content"]


@pytest.mark.parametrize("model", _content_models(), ids=lambda mdl: mdl.__name__)
def test_changelist_or_singleton_loads(seeded, admin_client, model):
    info = model._meta.app_label, model._meta.model_name
    r = admin_client.get(reverse("admin:%s_%s_changelist" % info), follow=True)
    assert r.status_code == 200
    if model in SINGLETONS:
        # singleton changelist redirects to the single change form
        assert r.redirect_chain and r.redirect_chain[-1][0].endswith(f"/{model.get_solo().pk}/change/")


@pytest.mark.parametrize("model", _content_models(), ids=lambda mdl: mdl.__name__)
def test_change_form_loads(seeded, admin_client, model):
    info = model._meta.app_label, model._meta.model_name
    obj = model.get_solo() if model in SINGLETONS else model.objects.first()
    if obj is None:  # MediaAsset has no seed rows; test the add form instead
        r = admin_client.get(reverse("admin:%s_%s_add" % info))
        assert r.status_code == 200
        return
    r = admin_client.get(reverse("admin:%s_%s_change" % info, args=[obj.pk]))
    assert r.status_code == 200
    assert b"Preview page" in r.content or model is m.MediaAsset
    # History tab is present (django-simple-history)
    assert reverse("admin:%s_%s_history" % info, args=[obj.pk]).encode() in r.content


@pytest.mark.parametrize("model", [mdl for mdl in _content_models() if mdl not in SINGLETONS and mdl is not m.MediaAsset], ids=lambda mdl: mdl.__name__)
def test_add_form_loads(seeded, admin_client, model):
    info = model._meta.app_label, model._meta.model_name
    assert admin_client.get(reverse("admin:%s_%s_add" % info)).status_code == 200


def test_singletons_have_no_add_or_delete(seeded, admin_client):
    info = ("content", "homepage")
    assert admin_client.get(reverse("admin:%s_%s_add" % info)).status_code == 403
    assert admin_client.get(reverse("admin:%s_%s_delete" % info, args=[1])).status_code == 403


def test_dashboard_loads(seeded, admin_client):
    r = admin_client.get(reverse("admin:index"))
    assert r.status_code == 200
    assert b"Last updated" in r.content


def test_edit_hero_title_via_admin_reaches_api(seeded, admin_client):
    home = m.HomePage.get_solo()
    url = reverse("admin:content_homepage_change", args=[home.pk])
    r = admin_client.get(url)
    assert r.status_code == 200
    form = r.context["adminform"].form
    data = {}
    for name, field in form.fields.items():
        value = form.initial.get(name, field.initial)
        if value is None:
            value = ""
        data[name] = value
    # inline management forms
    for fs in r.context["inline_admin_formsets"]:
        mf = fs.formset.management_form
        for k, v in mf.initial.items():
            data[f"{mf.prefix}-{k}"] = v
        for f in fs.formset.forms:
            for name, field in f.fields.items():
                v = f.initial.get(name, field.initial)
                if v is None:
                    v = ""
                data[f"{f.prefix}-{name}"] = v
    data["hero_title"] = "New headline\nSecond line"
    r = admin_client.post(url, data, follow=True)
    assert r.status_code == 200, r.content[:500]
    api = admin_client.get("/api/content/").json()
    assert api["data"]["home"]["hero"]["title"] == ["New headline", "Second line"]
    assert m.HomePage.history.count() >= 2


def test_history_revert(seeded, admin_client):
    home = m.HomePage.get_solo()
    original = home.hero_scroll_cue
    home.hero_scroll_cue = "temporary"
    home.save()
    older = home.history.order_by("-history_date", "-history_id")[1]  # the version just before the change
    older.instance.save()  # what the admin "Revert" button does
    assert m.HomePage.get_solo().hero_scroll_cue == original
    info = ("content", "homepage")
    r = admin_client.get(reverse("admin:%s_%s_history" % info, args=[home.pk]))
    assert r.status_code == 200
