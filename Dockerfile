# Stage 1: Build the frontend
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend/ ./
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
RUN npm run build

# Stage 2: Build the backend
FROM python:3.12-slim AS backend-builder
WORKDIR /app/backend
RUN pip install uv
COPY backend/pyproject.toml backend/uv.lock ./
ENV UV_SYSTEM_PYTHON=1
RUN uv sync
COPY backend/ ./

# Stage 3: Final image
FROM python:3.12-slim
WORKDIR /app

# Install Node.js by copying from the frontend-builder stage
COPY --from=frontend-builder /usr/local/bin/node /usr/local/bin/
COPY --from=frontend-builder /usr/local/lib/node_modules /usr/local/lib/node_modules
RUN ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm

# Copy frontend app and build artifacts
WORKDIR /app/frontend
COPY --from=frontend-builder /app/frontend/package.json /app/frontend/package-lock.json ./
RUN npm install --production
COPY --from=frontend-builder /app/frontend/next.config.mjs ./
COPY --from=frontend-builder /app/frontend/jsconfig.json ./
COPY --from=frontend-builder /app/frontend/postcss.config.mjs ./
COPY --from=frontend-builder /app/frontend/public ./public
COPY --from=frontend-builder /app/frontend/.next ./.next
COPY --from=frontend-builder /app/frontend/src ./src

# Copy backend app and dependencies
WORKDIR /app/backend
COPY --from=backend-builder /app/backend ./
RUN pip install uv
ENV UV_SYSTEM_PYTHON=1
RUN uv sync

# Set environment variables
ARG NEXT_PUBLIC_API_URL
ENV NODE_ENV=production
ENV PYTHONPATH=/app/backend
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Expose ports
EXPOSE 3001 8001

# Start script
COPY start.sh .
RUN chmod +x start.sh

# Run start script
CMD ["./start.sh"]