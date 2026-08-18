"""Celery app for DocuFlow AI v2 background stage execution.

Run from the repo root:
    celery -A apps.worker.worker.celery_app worker --loglevel=info

Broker/backend come from the API settings (REDIS_URL in apps/api/.env).
The API dispatches content stage activity via `docuflow.execute_stage`.
"""

import os
import sys

from celery import Celery

API_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "api"))
if API_DIR not in sys.path:
    sys.path.insert(0, API_DIR)

from app.core.config import get_settings  # noqa: E402

settings = get_settings()

celery_app = Celery("docuflow", broker=settings.redis_url, backend=settings.redis_url)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    worker_prefetch_multiplier=1,
    task_acks_late=True,
    task_default_queue="workflow",
    task_routes={
        "docuflow.execute_stage": {"queue": "workflow"},
        "docuflow.execute_stage.media": {"queue": "media"},
        "docuflow.execute_stage.llm": {"queue": "llm"},
        "docuflow.execute_stage.transcode": {"queue": "media"},
    },
)

celery_app.autodiscover_tasks(["apps.worker.worker"], force=True)

import apps.worker.worker.tasks  # noqa: E402, F401