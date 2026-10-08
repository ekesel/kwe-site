FROM python:3.12-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

RUN apt-get update \
    && apt-get install -y --no-install-recommends libpq5 curl \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd -r app && useradd -r -g app -d /app -s /usr/sbin/nologin app

WORKDIR /app

COPY requirements.txt requirements-dev.txt ./
RUN pip install -r requirements-dev.txt

COPY . .

RUN mkdir -p /data/media /app/staticfiles \
    && chown -R app:app /app /data \
    && chmod +x /app/entrypoint.sh

USER app

ENV MEDIA_ROOT=/data/media \
    STATIC_ROOT=/app/staticfiles \
    PORT=8000

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
    CMD curl -fsS http://localhost:8000/api/content/ -o /dev/null || exit 1

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["gunicorn"]
