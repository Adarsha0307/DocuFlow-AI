.PHONY: install dev web api worker workflow up down migrate seed test lint format mcp-view

# ---- Local full-stack ----
up:
	docker compose -f infra/docker/docker-compose.yml up -d postgres redis minio temporal

down:
	docker compose -f infra/docker/docker-compose.yml down

obervability:
	docker compose -f infra/docker/docker-compose.yml up -d prometheus grafana otel-collector

# ---- Frontend ----
web:
	npm run dev --workspace @docuflow/web

# ---- Backend ----
api:
	cd apps/api && uvicorn app.main:app --reload --port 8000

worker:
	cd apps/worker && python -m celery -A worker.celery_app worker --loglevel=info --concurrency=2

workflow:
	cd apps/worker && python -m celery -A worker.celery_app worker --loglevel=info --queue=media --concurrency=1

migrate:
	cd apps/api && alembic upgrade head

migrate-revision:
	cd apps/api && alembic revision --autogenerate -m "$(name)"

seed:
	python apps/api/app/db/seed.py

# ---- Test / quality ----
test:
	cd apps/api && python -m pytest tests -q

lint-py:
	cd apps/api && ruff check app tests

format-py:
	cd apps/api && ruff format app tests

typecheck:
	npm run typecheck

setup:
	python -m venv .venv
	.venv/bin/pip install -r apps/api/requirements.txt
	.venv/bin/pip install -r apps/worker/requirements.txt
	npm install