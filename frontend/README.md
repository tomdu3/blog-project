# Blog Project

This project consists of a Next.js frontend and a backend service.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm, yarn, pnpm, or bun

### Frontend

1.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

2.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Backend

**Option 1: Without Docker**

1.  **Navigate to the backend directory:**

    ```bash
    cd ../backend 
    ```

2.  **Install dependencies:**

    ```bash
    # Add command to install backend dependencies, e.g., pip install -r requirements.txt
    ```

3.  **Run the backend server:**

    ```bash
    # Add command to run the backend server, e.g., uvicorn main:app --reload
    ```

The backend will be available at `http://localhost:8000`.

**Option 2: With Docker**

1.  **Build and run the containers:**

    ```bash
    docker-compose up -d --build
    ```

The frontend will be available at [http://localhost:3000](http://localhost:3000) and the backend at [http://localhost:8000](http://localhost:8000).

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.