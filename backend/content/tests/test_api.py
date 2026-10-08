import json

from django.core.cache import cache

from content.assemble import build_content
from content.cache import CACHE_KEY
from content.models import HomePage, TeamMember


def test_content_endpoint_matches_seed(seeded, client):
    cache.clear()
    r = client.get("/api/content/")
    assert r.status_code == 200
    assert r["Cache-Control"] == "no-store"
    body = r.json()
    assert set(body) == {"data", "updated_at"}
    assert body["data"] == seeded
    assert body["data"] == json.loads(json.dumps(build_content()))


def test_endpoint_is_public_and_read_only(seeded, client):
    assert client.get("/api/content/").status_code == 200
    assert client.post("/api/content/", {}).status_code == 405


def test_cache_is_used_and_invalidated_on_save(seeded, client):
    cache.clear()
    client.get("/api/content/")
    assert cache.get(CACHE_KEY) is not None

    home = HomePage.get_solo()
    home.hero_scroll_cue = "Changed cue"
    home.save()
    assert cache.get(CACHE_KEY) is None, "post_save should invalidate the cached payload"

    r = client.get("/api/content/")
    assert r.json()["data"]["home"]["hero"]["scrollCue"] == "Changed cue"
    assert cache.get(CACHE_KEY) is not None


def test_stale_cache_in_another_process_is_rebuilt(seeded, client):
    """Simulates a second gunicorn worker: its locmem copy is old, the DB version moved on."""
    from content.models import ContentVersion

    cache.clear()
    client.get("/api/content/")
    stale = cache.get(CACHE_KEY)
    assert stale["version"] == ContentVersion.current().version

    home = HomePage.get_solo()
    home.hero_scroll_cue = "Changed elsewhere"
    home.save()
    # put the OLD payload back, as another process would still hold it
    cache.set(CACHE_KEY, stale, None)
    assert cache.get(CACHE_KEY)["data"]["home"]["hero"]["scrollCue"] != "Changed elsewhere"

    r = client.get("/api/content/")
    assert r.json()["data"]["home"]["hero"]["scrollCue"] == "Changed elsewhere"
    assert r.json()["updated_at"] == ContentVersion.current().updated_at.isoformat()


def test_cache_invalidated_on_delete(seeded, client):
    cache.clear()
    client.get("/api/content/")
    TeamMember.objects.first().delete()
    assert cache.get(CACHE_KEY) is None
    r = client.get("/api/content/")
    assert len(r.json()["data"]["team"]["members"]) == len(seeded["team"]["members"]) - 1


def test_uploaded_image_wins_over_external_url(seeded, client, settings, tmp_path):
    from django.core.files.uploadedfile import SimpleUploadedFile

    settings.MEDIA_ROOT = str(tmp_path)
    member = TeamMember.objects.first()
    png = (b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89"
           b"\x00\x00\x00\rIDATx\x9cc\xf8\x0f\x00\x00\x01\x01\x00\x05\x18\xd8N\x00\x00\x00\x00IEND\xaeB`\x82")
    member.image = SimpleUploadedFile("photo.png", png, content_type="image/png")
    member.save()
    cache.clear()
    data = client.get("/api/content/").json()["data"]
    me = next(x for x in data["team"]["members"] if x["slug"] == member.slug)
    assert me["image"].startswith("/media/uploads/")
