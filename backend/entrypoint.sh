#!/bin/sh
# migrate → ensure_admin → import seed if the DB is empty → collectstatic → serve
set -e

echo "==> Applying migrations"
python manage.py migrate --noinput

echo "==> Ensuring admin user"
python manage.py ensure_admin

echo "==> Importing seed content if the database is empty"
python manage.py import_content --if-empty

if [ "${SKIP_COLLECTSTATIC:-0}" != "1" ]; then
  echo "==> Collecting static files"
  python manage.py collectstatic --noinput --clear >/dev/null
fi

case "$1" in
  gunicorn)
    echo "==> Starting gunicorn on :${PORT:-8000}"
    exec gunicorn kwe.wsgi:application \
      --bind "0.0.0.0:${PORT:-8000}" \
      --workers "${GUNICORN_WORKERS:-3}" \
      --timeout "${GUNICORN_TIMEOUT:-120}" \
      --access-logfile - --error-logfile -
    ;;
  runserver)
    echo "==> Starting Django dev server on :${PORT:-8000}"
    exec python manage.py runserver "0.0.0.0:${PORT:-8000}"
    ;;
  *)
    exec "$@"
    ;;
esac
