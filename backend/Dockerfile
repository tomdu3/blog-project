# Stage 1: Build the backend
FROM python:3.12-slim AS backend-builder
WORKDIR /app/backend
RUN pip install uv
COPY pyproject.toml uv.lock ./
ENV UV_SYSTEM_PYTHON=1
RUN uv sync
COPY . .

# Stage 2: Final image
FROM python:3.12-slim
WORKDIR /app
COPY --from=backend-builder /app/backend /app
RUN pip install uv
ENV UV_SYSTEM_PYTHON=1
RUN uv sync

ENV PATH="/app/.venv/bin:$PATH"

# Expose port
EXPOSE 8001

# Run start script
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]
