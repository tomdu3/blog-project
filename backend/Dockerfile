FROM python:3.12-slim

# Install uv.
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Copy the application into the container.
COPY . /app
WORKDIR /app

# Create virtual environment and install dependencies
RUN uv venv .venv && \
    . .venv/bin/activate && \
    uv sync --frozen --no-cache

# Run the application.
CMD ["uvicorn", "main:app", "--port=8000", "--host=0.0.0.0"]