FROM python:3.12.11-alpine

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

COPY . /app
WORKDIR /app

RUN /bin/uv venv .venv && \
    . .venv/bin/activate && \
    /bin/uv sync --frozen --no-cache

# Directly use virtual environment's uvicorn
CMD ["/app/.venv/bin/uvicorn", "app.main:app", "--port=8000", "--host=0.0.0.0"]