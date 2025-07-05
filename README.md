# Blog Project

This is a Blog Project based on FastAPI, React, TailwindCSS, and Notion as a CMS.

## Getting Started

### Prerequisites

- Python 3.12
- Node.js 24.x
- Notion API Key

### Installation

#### Backend Setup

```bash
cd backend
uv sync
```

#### Frontend Setup

```bash
cd frontend
npm install
```

### Running the Application

#### Local Development

**Backend (FastAPI):**
```bash
cd backend
uv run uvicorn app.main:app --reload --port=8000 --host=0.0.0.0
```

**Frontend (Next.js):**
```bash
cd frontend
npm run dev
```

#### Using Docker

**Option 1: Docker Compose (Recommended)**
```bash
cd backend
docker-compose up -d --build
```

**Option 2: Individual Docker Build**
```bash
cd backend
docker build -t blog-project-backend .
docker run -p 8000:8000 blog-project-backend
```

### Production Deployment

#### Docker Production Setup

The backend Dockerfile is optimized for production with:
- Multi-stage Alpine Linux build for security and minimal size
- Non-root user execution
- Health checks for container orchestration
- Vulnerability-free base images

**Build production image:**
```bash
cd backend
docker build -t blog-project-backend:production .
```

**Run in production:**
```bash
docker run -d \
  --name blog-project-backend \
  -p 8000:8000 \
  --restart unless-stopped \
  -e NOTION_API_KEY=${NOTION_API_KEY} \
  blog-project-backend:production
```

**Production with Docker Compose:**
```bash
cd backend
# Set environment variables
export NOTION_API_KEY=your_notion_api_key
docker-compose up -d
```

#### Health Monitoring

Monitor your production deployment:
```bash
# Check container health
docker ps

# View logs
docker logs blog-project-backend

# Health check endpoint
curl http://localhost:8000/
```

### API Documentation

Once the backend is running, access the FastAPI documentation:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

### Environment Variables

Create a `.env` file in the backend directory:
```bash
NOTION_API_KEY=your_notion_api_key_here
```
