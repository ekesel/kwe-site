import json
from pathlib import Path

import pytest
from django.contrib.auth import get_user_model

from content.importer import import_data

SEED = Path(__file__).resolve().parents[2] / "seed" / "data.json"


@pytest.fixture(scope="session")
def seed_json():
    with SEED.open(encoding="utf-8") as fh:
        return json.load(fh)


@pytest.fixture
def seeded(db, seed_json):
    import_data(seed_json)
    return seed_json


@pytest.fixture
def admin_client(db, client):
    user = get_user_model().objects.create_superuser("admin", "admin@example.com", "pw-for-tests")
    client.force_login(user)
    return client
