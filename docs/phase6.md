# Phase 6: Deployment and Bug Fixing

This phase covers the deployment of the application and the bug fixes that were implemented.

## Deployment

The application was deployed to the following URLs:

- **Frontend:** [https://blog-project.tomdcoding.net/](https://blog-project.tomdcoding.net/)
- **Backend:** [https://blog-project-be.tomdcoding.net/](https://blog-project-be.tomdcoding.net/)

## Bug Fixes

### Frontend Docker Build Failure

- **Issue:** The frontend Docker build was failing because the `NEXT_PUBLIC_API_URL` environment variable was not set during the build process.
- **Fix:** A default value for `NEXT_PUBLIC_API_URL` was added to the `frontend/Dockerfile` to ensure the build process can complete successfully.

### "No posts found" on Deployed Homepage

- **Issue:** The deployed homepage was showing "No posts found" because the frontend was not fetching data during the Next.js build process.
- **Fix:** The logic in `frontend/src/lib/api.js` was updated to remove the condition that skipped data fetching during the build. This ensures that the blog posts are fetched and included in the statically generated homepage.
