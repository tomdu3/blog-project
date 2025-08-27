# syntax=docker/dockerfile:1.7-labs

# Stage 1: build + create venv with your project installed (non-editable)
FROM python:3.12-slim AS builder

# Bring in uv/uvx binaries (fast installer, no pip)
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

# 1) Resolve and install dependencies only (no project code), fully cached by lockfile
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --locked --no-install-project --no-editable

# 2) Add the rest of the project and install it into the venv (non-editable -> packaged wheel)
ADD . /app
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked --no-editable

# Stage 2: runtime with just Python + venv containing your app and deps
FROM python:3.12-slim

# Optional: create a non-root user
RUN groupadd -r app && useradd --no-log-init -r -g app app
WORKDIR /app

# Copy only the venv produced by the builder stage
COPY --from=builder --chown=app:app /app/.venv /app/.venv

# Expose FastAPI port
EXPOSE 8001

# Drop privileges
USER app

# Start uvicorn from the venv; your app must be importable as `app.main:app`
CMD ["/app/.venv/bin/uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]