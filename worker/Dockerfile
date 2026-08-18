FROM python:3.12-slim

WORKDIR /worker

COPY apps/api/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY apps/worker/worker ./apps/worker/worker

WORKDIR /
ENV PYTHONPATH=/worker
CMD ["celery", "-A", "apps.worker.worker.celery_app", "worker", "-Q", "workflow", "--loglevel", "info"]