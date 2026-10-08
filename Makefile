COMPOSE      = docker compose
COMPOSE_DEV  = docker compose -f docker-compose.yml -f docker-compose.dev.yml
BACKUP_DIR   = backups
STAMP       := $(shell date +%Y%m%d-%H%M%S)

.PHONY: help up dev build logs down ps restart backup-db restore-db sync-seed test test-backend test-frontend export-content shell createsuperuser

help:
	@echo "make up              build + start production stack (site :80, CMS /admin/)"
	@echo "make dev             start dev stack (Django runserver :8000, Vite :5173)"
	@echo "make logs            follow logs"
	@echo "make down            stop stack (volumes kept)"
	@echo "make backup-db       dump Postgres to $(BACKUP_DIR)/kwe-<stamp>.sql.gz"
	@echo "make restore-db FILE=backups/kwe-….sql.gz"
	@echo "make sync-seed       copy frontend/src/data.json -> backend/seed/data.json"
	@echo "make test            run backend (pytest) and frontend (tsc + build) checks"
	@echo "make export-content  print the live content JSON from the running backend"
	@echo "make shell           Django shell in the backend container"
	@echo "make createsuperuser create an extra admin user"

up:
	$(COMPOSE) up --build -d
	@echo "Site: http://localhost:$${WEB_PORT:-80}/   CMS: http://localhost:$${WEB_PORT:-80}/admin/"

build:
	$(COMPOSE) build

dev:
	$(COMPOSE_DEV) up --build

logs:
	$(COMPOSE) logs -f --tail=200

ps:
	$(COMPOSE) ps

down:
	$(COMPOSE) down

restart:
	$(COMPOSE) restart backend web

backup-db:
	@mkdir -p $(BACKUP_DIR)
	$(COMPOSE) exec -T db sh -c 'pg_dump -U "$$POSTGRES_USER" "$$POSTGRES_DB"' | gzip > $(BACKUP_DIR)/kwe-$(STAMP).sql.gz
	@echo "Wrote $(BACKUP_DIR)/kwe-$(STAMP).sql.gz"

restore-db:
	@test -n "$(FILE)" || (echo "usage: make restore-db FILE=backups/kwe-….sql.gz" && exit 1)
	$(COMPOSE) stop backend
	gunzip -c $(FILE) | $(COMPOSE) exec -T db sh -c 'psql -v ON_ERROR_STOP=1 -U "$$POSTGRES_USER" "$$POSTGRES_DB"'
	$(COMPOSE) start backend

backup-media:
	@mkdir -p $(BACKUP_DIR)
	$(COMPOSE) exec -T backend tar czf - -C /data media > $(BACKUP_DIR)/media-$(STAMP).tar.gz
	@echo "Wrote $(BACKUP_DIR)/media-$(STAMP).tar.gz"

sync-seed:
	cp frontend/src/data.json backend/seed/data.json
	@echo "backend/seed/data.json updated"

test: test-backend test-frontend

test-backend:
	cd backend && (test -x .venv/bin/python || (python3 -m venv .venv && .venv/bin/pip install -q -r requirements-dev.txt)) && .venv/bin/python -m pytest -q

test-frontend:
	cd frontend && npm ci --silent && npx tsc --noEmit && npm run build

export-content:
	$(COMPOSE) exec -T backend python manage.py export_content

shell:
	$(COMPOSE) exec backend python manage.py shell

createsuperuser:
	$(COMPOSE) exec backend python manage.py createsuperuser
