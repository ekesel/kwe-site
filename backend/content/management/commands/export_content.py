import json

from django.core.management.base import BaseCommand

from content.assemble import build_content


class Command(BaseCommand):
    help = "Dump the assembled site content (same shape as data.json) to stdout or a file."

    def add_arguments(self, parser):
        parser.add_argument("--out", "-o", help="Write to this file instead of stdout.")
        parser.add_argument("--indent", type=int, default=2)

    def handle(self, *args, **opts):
        text = json.dumps(build_content(), indent=opts["indent"], ensure_ascii=False) + "\n"
        if opts["out"]:
            with open(opts["out"], "w", encoding="utf-8") as fh:
                fh.write(text)
            self.stdout.write(self.style.SUCCESS(f"Wrote {opts['out']}"))
        else:
            self.stdout.write(text)
