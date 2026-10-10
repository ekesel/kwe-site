"""
The contract: importing seed/data.json and assembling it back must produce the
original JSON exactly (same keys, nesting, types and ordering).
"""

import json
import re

from content.assemble import build_content

MEDIA = re.compile(r"^(https?://|/media/)")


def normalise(obj):
    """Media URLs are compared by presence only (uploads vs external URLs)."""
    if isinstance(obj, dict):
        return {k: normalise(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [normalise(v) for v in obj]
    if isinstance(obj, str) and MEDIA.match(obj) and re.search(r"\.(jpe?g|png|webp|gif|svg|avif|mp4|webm|mov)(\?|$)", obj):
        return "<media>"
    return obj


def _diff(a, b, path="$"):
    if type(a) is not type(b):
        return [f"{path}: type {type(a).__name__} != {type(b).__name__}"]
    if isinstance(a, dict):
        out = []
        for k in set(a) | set(b):
            if k not in a:
                out.append(f"{path}.{k}: missing in expected")
            elif k not in b:
                out.append(f"{path}.{k}: missing in actual")
            else:
                out += _diff(a[k], b[k], f"{path}.{k}")
        return out
    if isinstance(a, list):
        if len(a) != len(b):
            return [f"{path}: length {len(a)} != {len(b)}"]
        out = []
        for i, (x, y) in enumerate(zip(a, b)):
            out += _diff(x, y, f"{path}[{i}]")
        return out
    return [] if a == b else [f"{path}: {a!r} != {b!r}"]


def test_roundtrip_exact(seeded):
    built = build_content()
    diffs = _diff(seeded, built)
    assert not diffs, "\n".join(diffs[:40])
    assert built == seeded  # image URLs were imported as external URLs, so no normalisation needed


def test_roundtrip_normalised_and_key_order(seeded):
    built = build_content()
    assert normalise(built) == normalise(seeded)
    # key order matters to humans diffing the export — keep it identical to the seed file
    assert json.dumps(built, ensure_ascii=False) == json.dumps(seeded, ensure_ascii=False)


def test_import_is_idempotent(seeded):
    from content.importer import import_data

    import_data(seeded)
    import_data(seeded)
    assert build_content() == seeded


def test_import_force_wipes_and_reimports(seeded, tmp_path):
    from django.core.management import call_command

    from content.models import HomePage, TeamMember

    TeamMember.objects.create(slug="stale-person", name="Stale", role="x", focus="x", order=99)
    HomePage.objects.update(intro_statement="edited in the admin")
    path = tmp_path / "data.json"
    path.write_text(json.dumps(seeded), encoding="utf-8")
    call_command("import_content", str(path), "--force")
    assert not TeamMember.objects.filter(slug="stale-person").exists()
    assert build_content() == seeded


def test_seed_fits_column_lengths(seeded):
    """SQLite ignores varchar lengths; Postgres does not. Catch over-long copy before it reaches production."""
    from django.apps import apps
    from django.db import models

    too_long = []
    for model in apps.get_app_config("content").get_models():
        if model.__name__.startswith("Historical"):
            continue
        fields = [f for f in model._meta.fields if isinstance(f, models.CharField) and f.max_length]
        for obj in model.objects.all():
            for f in fields:
                value = getattr(obj, f.attname) or ""
                if len(value) > f.max_length:
                    too_long.append(f"{model.__name__}.{f.name}: {len(value)} > {f.max_length}")
    assert not too_long, "\n".join(too_long)


def test_import_force_is_atomic(seeded, tmp_path):
    """A failing --force import must not leave the database wiped."""
    import pytest
    from django.core.management import call_command

    broken = dict(seeded)
    broken.pop("story")
    path = tmp_path / "broken.json"
    path.write_text(json.dumps(broken), encoding="utf-8")
    with pytest.raises(KeyError):
        call_command("import_content", str(path), "--force")
    assert build_content() == seeded
