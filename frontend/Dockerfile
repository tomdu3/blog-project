# Stage 1: Build the frontend
FROM node:20-slim AS frontend-builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .

# Use ARG to accept the variable at build time.
ARG NEXT_PUBLIC_API_URL
# Set ENV so it's available to the npm run build command.
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
# Fail the build if the variable is not set.
RUN test -n "$NEXT_PUBLIC_API_URL" || (echo "NEXT_PUBLIC_API_URL is not set" && exit 1)

RUN npm run build

# Stage 2: Final image
FROM node:20-slim
WORKDIR /app
COPY --from=frontend-builder /app/package.json /app/package-lock.json ./
RUN npm install --production
COPY --from=frontend-builder /app/next.config.mjs ./
COPY --from=frontend-builder /app/jsconfig.json ./
COPY --from=frontend-builder /app/postcss.config.mjs ./
COPY --from=frontend-builder /app/public ./public
COPY --from=frontend-builder /app/.next ./.next
COPY --from=frontend-builder /app/src ./src

# Also expose the env var to the final running container
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Expose port
EXPOSE 3001

# Run start script
CMD ["npm", "start", "--", "--port", "3001"]
