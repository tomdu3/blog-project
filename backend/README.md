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

    Update the `.env` file with your environment variables. See the **Environment Variables** section for a full list.

3.  **Run the development server:**

    ```bash
    uv run uvicorn app.main:app --reload --port=8000 --host=0.0.0.0
    ```

The API will be available at `http://localhost:8000`.

### Local Deployment with Docker

**Option 1: Docker Compose (Recommended)**

1.  **Set up environment variables:**

    Create a `.env` file from `.env.example` and add your environment variables. See the **Environment Variables** section for a full list.

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
      --env-file .env \
      blog-project-backend
    ```

### API Documentation

Once the backend is running, you can access the interactive API documentation at:

-   **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
-   **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)


### Environment Variables

-   `NOTION_API_KEY`: Your Notion integration token.
-   `NOTION_DATABASE_ID`: The ID of your Notion database.
-   `REDIS_URL`: The URL for the Redis cache (e.g., `redis://localhost:6379`).
-   `REFRESH_TOKEN`: A secret token to trigger a database refresh.
-   `CORS_ALLOWED_ORIGINS`: A comma-separated list of allowed origins for CORS (e.g., `http://localhost:3001,https://your-frontend-domain.com`).
-   `EMAIL_HOST`: The SMTP server for sending emails.
-   `EMAIL_PORT`: The port for the SMTP server.
-   `EMAIL_USER`: The username for the SMTP server.
-   `EMAIL_PASSWORD`: The password for the SMTP server.
-   `EMAIL_FROM`: The email address to send emails from.
-   `EMAIL_TO`: The email address to send emails to.
-   `EMAIL_STARTTLS`: Whether to use STARTTLS (e.g., `True` or `False`).
-   `EMAIL_SSL_TLS`: Whether to use SSL/TLS (e.g., `True` or `False`).
-   `USE_CREDENTIALS`: Whether to use credentials for SMTP (e.g., `True` or `False`).
-   `VALIDATE_CERTS`: Whether to validate SSL certificates (e.g., `True` or `False`).