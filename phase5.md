# Phase 5: Deployment

This document outlines the steps taken to deploy the blog project, the challenges encountered, and the solutions implemented.

## Backend Deployment (FastAPI)

The backend was deployed using Docker.

1.  **Docker Image:** A production-ready Docker image was built using the provided `Dockerfile`.
    ```bash
    docker build -t blog-project-backend:production .
    ```
2.  **Containerization:** The application was run as a Docker container.
    - **Initial Failure:** The first attempt to run the container failed because the `NOTION_DATABASE_ID` environment variable was missing. The logs showed a "500 Internal Server Error" and an error message indicating the missing variable.
    - **Solution:** The container was stopped, removed, and restarted with both the `NOTION_API_KEY` and `NOTION_DATABASE_ID` environment variables.
    ```bash
    docker run -d \
      --name blog-project-backend \
      -p 8000:8000 \
      --restart unless-stopped \
      -e NOTION_API_KEY=your_notion_api_key \
      -e NOTION_DATABASE_ID=your_notion_database_id \
      blog-project-backend:production
    ```
3.  **Verification:** The backend was verified to be working correctly by using `curl` to fetch posts from the `/posts` endpoint.

## Frontend Deployment (Next.js)

The frontend was prepared for production deployment.

1.  **Build Process:** The Next.js application was built for production using `npm run build`.
    - **Initial Failure:** The build process failed with a TypeScript error: `Type '{ params: { slug: string; }; }' does not satisfy the constraint 'PageProps'`.
    - **Investigation:** The error was caused by a breaking change in Next.js 15, where the `params` object in page components is now a `Promise`.
    - **Solution:** The `[slug]/page.tsx` file was updated to `await` the `params` object and the type annotation was changed to `Promise<{ slug: string }>`. 
2.  **Production Server:** The application is ready to be started in production mode using `npm run start`.

```