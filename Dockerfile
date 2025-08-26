# Stage 1: Build the frontend
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the backend
FROM python:3.12-slim AS backend-builder
WORKDIR /app/backend
RUN pip install uv
COPY backend/pyproject.toml backend/uv.lock ./
RUN uv pip sync --system pyproject.toml
COPY backend/ ./

# Stage 3: Final image
FROM python:3.12-slim
WORKDIR /app

# Install Node.js
RUN apt-get update && apt-get install -y nodejs npm && npm install -g npm@latest

# Copy frontend app and build artifacts
WORKDIR /app/frontend
COPY --from=frontend-builder /app/frontend/package.json /app/frontend/package-lock.json ./
RUN npm install --production
COPY --from=frontend-builder /app/frontend/next.config.ts ./
COPY --from=frontend-builder /app/frontend/public ./public
COPY --from=frontend-builder /app/frontend/.next ./.next

# Copy backend app and dependencies
WORKDIR /app/backend
COPY --from=backend-builder /app/backend ./
COPY --from=backend-builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=backend-builder /usr/local/bin/uvicorn /usr/local/bin/
COPY --from=backend-builder /usr/local/bin/fastapi /usr/local/bin/

# Set environment variables
ENV NODE_ENV=production
ENV PYTHONPATH=/app/backend

# Expose ports
EXPOSE 3000 8000

# Start script
COPY start.sh .
RUN chmod +x start.sh

# Run start script
CMD ["./start.sh"]
