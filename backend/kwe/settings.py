"""
Django settings for the KWE Advisors content backend.

Everything environment-specific comes from env vars (see /.env.example).
"""

import sys
from pathlib import Path

import environ
from django.templatetags.static import static
from django.urls import reverse_lazy

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env(
    DEBUG=(bool, False),
    SECRET_KEY=(str, "dev-only-insecure-secret-key-change-me"),
    ALLOWED_HOSTS=(list, ["localhost", "127.0.0.1"]),
    CSRF_TRUSTED_ORIGINS=(list, []),
    DATABASE_URL=(str, f"sqlite:///{BASE_DIR / 'db.sqlite3'}"),
    MEDIA_ROOT=(str, str(BASE_DIR / "media")),
    STATIC_ROOT=(str, str(BASE_DIR / "staticfiles")),
    SITE_URL=(str, "/"),
    USE_S3=(bool, False),
)
environ.Env.read_env(BASE_DIR.parent / ".env")
environ.Env.read_env(BASE_DIR / ".env")

SECRET_KEY = env("SECRET_KEY")
DEBUG = env("DEBUG")
ALLOWED_HOSTS = env("ALLOWED_HOSTS")
CSRF_TRUSTED_ORIGINS = env("CSRF_TRUSTED_ORIGINS")

# Public URL of the website (used for the "View site" / "Preview page" admin buttons).
SITE_URL = env("SITE_URL")

INSTALLED_APPS = [
    "unfold",
    "unfold.contrib.forms",
    "unfold.contrib.inlines",
    "unfold.contrib.simple_history",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "solo",
    "simple_history",
    "content",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "simple_history.middleware.HistoryRequestMiddleware",
]

ROOT_URLCONF = "kwe.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "kwe.wsgi.application"

DATABASES = {"default": env.db("DATABASE_URL")}
DATABASES["default"].setdefault("CONN_MAX_AGE", 60)
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-gb"
TIME_ZONE = "Europe/London"
USE_I18N = True
USE_TZ = True

# --- Static & media -----------------------------------------------------------
STATIC_URL = "/static/"
STATIC_ROOT = env("STATIC_ROOT")
TESTING = "pytest" in sys.modules
STORAGES = {
    "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
    # Hashed + compressed static files in production; plain storage in dev/tests (no collectstatic needed).
    "staticfiles": {
        "BACKEND": (
            "django.contrib.staticfiles.storage.StaticFilesStorage"
            if DEBUG or TESTING
            else "whitenoise.storage.CompressedManifestStaticFilesStorage"
        )
    },
}
MEDIA_URL = "/media/"
MEDIA_ROOT = env("MEDIA_ROOT")

if env("USE_S3"):  # optional, off by default
    STORAGES["default"] = {
        "BACKEND": "storages.backends.s3.S3Storage",
        "OPTIONS": {
            "bucket_name": env("AWS_STORAGE_BUCKET_NAME"),
            "region_name": env("AWS_S3_REGION_NAME", default=None),
            "custom_domain": env("AWS_S3_CUSTOM_DOMAIN", default=None),
            "default_acl": "public-read",
            "querystring_auth": False,
        },
    }

# Upload limits (enforced by validators in content/validators.py)
MAX_IMAGE_UPLOAD_BYTES = 10 * 1024 * 1024
MAX_VIDEO_UPLOAD_BYTES = 100 * 1024 * 1024
DATA_UPLOAD_MAX_MEMORY_SIZE = MAX_VIDEO_UPLOAD_BYTES + 1024 * 1024
FILE_UPLOAD_MAX_MEMORY_SIZE = 5 * 1024 * 1024

# --- Cache (content API response) -------------------------------------------
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "kwe-content",
        "TIMEOUT": None,
    }
}

# --- DRF ---------------------------------------------------------------------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [],
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.AllowAny"],
    "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"],
    "UNAUTHENTICATED_USER": None,
}

# --- Security (production) ----------------------------------------------------
if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    USE_X_FORWARDED_HOST = True
    SESSION_COOKIE_SECURE = env("SESSION_COOKIE_SECURE", default=False)
    CSRF_COOKIE_SECURE = env("CSRF_COOKIE_SECURE", default=False)

LOGIN_URL = "/admin/login/"
LOGIN_REDIRECT_URL = "/admin/"

# --- django-unfold ------------------------------------------------------------
UNFOLD = {
    "SITE_TITLE": "KWE Advisors — Content",
    "SITE_HEADER": "KWE Advisors",
    "SITE_SUBHEADER": "Content management",
    "SITE_URL": SITE_URL,
    "SITE_SYMBOL": "edit_note",
    "SITE_ICON": {
        "light": lambda request: static("content/logo-mark.svg"),
        "dark": lambda request: static("content/logo-mark.svg"),
    },
    "SITE_FAVICONS": [
        {"rel": "icon", "sizes": "32x32", "type": "image/svg+xml", "href": lambda request: static("content/logo-mark.svg")},
    ],
    "SHOW_HISTORY": True,
    "SHOW_VIEW_ON_SITE": True,
    "SHOW_BACK_BUTTON": True,
    "DASHBOARD_CALLBACK": "content.dashboard.dashboard_callback",
    "LOGIN": {"image": lambda request: static("content/login.svg")},
    "STYLES": [lambda request: static("content/admin.css")],
    "BORDER_RADIUS": "6px",
    "COLORS": {
        # G1 dark green (#061B20) scale — brand primary.
        "primary": {
            "50": "#EEF3F4",
            "100": "#DCE5E6",
            "200": "#C5D4D7",
            "300": "#9CB5B9",
            "400": "#729597",
            "500": "#4C6569",
            "600": "#2D4748",
            "700": "#1E3336",
            "800": "#12272B",
            "900": "#061B20",
            "950": "#03110F",
        },
        "base": {
            "50": "#F8FAFA",
            "100": "#F0F4F4",
            "200": "#E1E8E9",
            "300": "#C9D5D7",
            "400": "#93A7AA",
            "500": "#637A7D",
            "600": "#4A5E61",
            "700": "#374A4C",
            "800": "#233234",
            "900": "#152022",
            "950": "#0B1415",
        },
        "font": {
            "subtle-light": "var(--color-base-500)",
            "subtle-dark": "var(--color-base-400)",
            "default-light": "var(--color-base-700)",
            "default-dark": "var(--color-base-300)",
            "important-light": "var(--color-base-900)",
            "important-dark": "var(--color-base-100)",
        },
    },
    "SIDEBAR": {
        "show_search": True,
        "show_all_applications": False,
        "navigation": [
            {
                "title": "Site",
                "separator": False,
                "items": [
                    {"title": "Dashboard", "icon": "dashboard", "link": reverse_lazy("admin:index")},
                    {"title": "Site settings", "icon": "settings", "link": reverse_lazy("admin:content_sitesettings_changelist")},
                    {"title": "Navigation", "icon": "menu", "link": reverse_lazy("admin:content_navlink_changelist")},
                    {"title": "Footer", "icon": "vertical_align_bottom", "link": reverse_lazy("admin:content_footercolumn_changelist")},
                ],
            },
            {
                "title": "Pages",
                "separator": True,
                "collapsible": False,
                "items": [
                    {"title": "Home", "icon": "home", "link": reverse_lazy("admin:content_homepage_changelist")},
                    {"title": "Our story", "icon": "auto_stories", "link": reverse_lazy("admin:content_storypage_changelist")},
                    {"title": "Our process", "icon": "route", "link": reverse_lazy("admin:content_processpage_changelist")},
                    {"title": "Contact", "icon": "mail", "link": reverse_lazy("admin:content_contactpage_changelist")},
                    {"title": "Legal", "icon": "gavel", "link": reverse_lazy("admin:content_legalpage_changelist")},
                    {"title": "Team page settings", "icon": "groups", "link": reverse_lazy("admin:content_teampagesettings_changelist")},
                    {"title": "Solutions page settings", "icon": "grid_view", "link": reverse_lazy("admin:content_solutionspagesettings_changelist")},
                    {"title": "Case studies page settings", "icon": "work", "link": reverse_lazy("admin:content_casestudiespagesettings_changelist")},
                    {"title": "Insights page settings", "icon": "newspaper", "link": reverse_lazy("admin:content_insightspagesettings_changelist")},
                ],
            },
            {
                "title": "Content",
                "separator": True,
                "items": [
                    {"title": "Team members", "icon": "person", "link": reverse_lazy("admin:content_teammember_changelist")},
                    {"title": "Solutions", "icon": "category", "link": reverse_lazy("admin:content_solution_changelist")},
                    {"title": "Case studies", "icon": "cases", "link": reverse_lazy("admin:content_casestudy_changelist")},
                    {"title": "Insights", "icon": "article", "link": reverse_lazy("admin:content_insight_changelist")},
                    {"title": "Extra cards", "icon": "view_agenda", "link": reverse_lazy("admin:content_extracard_changelist")},
                ],
            },
            {
                "title": "Filters",
                "separator": True,
                "items": [
                    {"title": "Filter groups", "icon": "filter_list", "link": reverse_lazy("admin:content_filtergroup_changelist")},
                ],
            },
            {
                "title": "Media",
                "separator": True,
                "items": [
                    {"title": "Media library", "icon": "perm_media", "link": reverse_lazy("admin:content_mediaasset_changelist")},
                ],
            },
            {
                "title": "Administration",
                "separator": True,
                "collapsible": True,
                "items": [
                    {"title": "Users", "icon": "manage_accounts", "link": reverse_lazy("admin:auth_user_changelist"), "permission": lambda request: request.user.is_superuser},
                    {"title": "Groups", "icon": "admin_panel_settings", "link": reverse_lazy("admin:auth_group_changelist"), "permission": lambda request: request.user.is_superuser},
                ],
            },
        ],
    },
}

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {"console": {"class": "logging.StreamHandler"}},
    "root": {"handlers": ["console"], "level": "INFO"},
}
