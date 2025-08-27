#!/bin/bash

# Start the backend in the background
cd /app/backend
echo "Starting backend server..."
source .venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8001 &

# Start the frontend in the foreground
cd /app/frontend
echo "Starting frontend server..."
npm start -- --port 3001
