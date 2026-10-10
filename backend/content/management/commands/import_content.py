import json
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import transaction

from content.cache import invalidate_content
from content.importer import import_data, is_empty, wipe_content

DEFAULT_SEED = Path(settings.BASE_DIR) / "seed" / "data.json"


class Command(BaseCommand):
    help = "Load a data.json file into the content models. Idempotent: replaces all content with the file."

    def add_arguments(self, parser):
        parser.add_argument("file", nargs="?", default=str(DEFAULT_SEED), help="Path to data.json (default: seed/data.json)")
        parser.add_argument("--if-empty", action="store_true", help="Only import when the database holds no content yet (first boot).")
        parser.add_argument("--force", action="store_true", help="Wipe every content table (singleton pages included) before importing, so nothing stale survives a schema change.")

    def handle(self, *args, **opts):
        if opts["if_empty"] and not is_empty():
            self.stdout.write("Content already present — skipping import.")
            return
        path = Path(opts["file"])
        with path.open(encoding="utf-8") as fh:
            data = json.load(fh)
        # one transaction: if the import fails, the wipe is rolled back too and the site keeps its content
        with transaction.atomic():
            if opts["force"]:
                wipe_content()
                self.stdout.write("Wiped existing content.")
            import_data(data)
        invalidate_content()
        self.stdout.write(self.style.SUCCESS(f"Imported content from {path}"))
