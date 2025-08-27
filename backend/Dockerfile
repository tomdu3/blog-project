# syntax=docker/dockerfile:1.7-labs

FROM python:3.12-slim AS builder
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/
WORKDIR /app

# Cache deps by lockfile + pyproject located in backend/
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=backend/uv.lock,target=uv.lock \
    --mount=type=bind,source=backend/pyproject.toml,target=pyproject.toml \
    uv sync --locked --no-install-project --no-editable

# Add only the backend source and install it (non-editable)
ADD backend/ /app/
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked --no-editable

FROM python:3.12-slim
RUN groupadd -r app && useradd --no-log-init -r -g app app
WORKDIR /app

COPY --from=builder --chown=app:app /app /app

EXPOSE 8001
USER app
CMD ["/app/.venv/bin/uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]