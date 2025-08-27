# Backend

This is the FastAPI backend for the blog project. It serves blog posts from the Notion API.

## Getting Started

### Prerequisites

-   Python 3.12
-   `uv` package manager (`pip install uv`)
-   Notion API Key

### Local Development (Without Docker)

1.  **Install dependencies:**

    ```bash
    uv sync
    ```

2.  **Set up environment variables:**

    Create a `.env` file by copying the sample file:

    ```bash
    cp .env.example .env
    ```

    Update the `.env` file with your `NOTION_API_KEY` and `NOTION_DATABASE_ID`.

3.  **Run the development server:**

    ```bash
    uv run uvicorn app.main:app --reload --port=8000 --host=0.0.0.0
    ```

The API will be available at `http://localhost:8000`.

### Local Deployment with Docker

**Option 1: Docker Compose (Recommended)**

1.  **Set up environment variables:**

    Create a `.env` file from `.env.example` and add your `NOTION_API_KEY`.

2.  **Build and run the container:**

    ```bash
    docker-compose up -d --build
    ```

**Option 2: Manual Docker Build**

1.  **Build the Docker image:**

    ```bash
    docker build -t blog-project-backend .
    ```

2.  **Run the Docker container:**

    ```bash
    docker run -d \
      --name blog-project-backend \
      -p 8000:8000 \
      --restart unless-stopped \
      -e NOTION_API_KEY=${NOTION_API_KEY} \
      -e NOTION_DATABASE_ID=${NOTION_DATABASE_ID} \
      blog-project-backend

### API Documentation

Once the backend is running, you can access the interactive API documentation at:

-   **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
-   **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)
