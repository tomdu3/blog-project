# Stage 1: Build the frontend
FROM node:20-slim AS frontend-builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
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

# Expose port
EXPOSE 3001

# Run start script
CMD ["npm", "start", "--", "--port", "3001"]
