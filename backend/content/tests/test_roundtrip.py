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
