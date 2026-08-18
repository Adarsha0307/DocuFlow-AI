"""Worker tasks: one idempotent task per executed workflow step."""

import logging
import uuid

from celery.utils.log import get_task_logger

from apps.worker.worker.celery_app import celery_app

logger: logging.Logger = get_task_logger(__name__)


@celery_app.task(name="docuflow.execute_stage", bind=True, max_retries=3, default_retry_delay=10)
def execute_stage(self, run_id: str, step_id: str, attempt: int | None = None) -> str:
    """Executes a single queued stage for a run; returns the resulting step state."""
    from app.db.session import SessionLocal
    from app.workflow.executor import execute_step_task

    db = SessionLocal()
    try:
        state = execute_step_task(db, uuid.UUID(run_id), uuid.UUID(step_id))
        logger.info("stage executed", extra={"run_id": run_id, "step_id": step_id, "state": state})
        return state
    except Exception as exc:  # pragma: no cover
        logger.exception(
            "stage failed", extra={"run_id": run_id, "step_id": step_id}
        )
        raise self.retry(exc=exc)
    finally:
        db.close()