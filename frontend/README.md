# Frontend

This is the Next.js frontend for the blog project.

## Getting Started

### Prerequisites

- Node.js (v20 or later)
- npm

### Installation

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Set up environment variables:**

    Create a `.env.local` file by copying the sample file:

    ```bash
    cp .env.local-sample .env.local
    ```

    Update `.env.local` with the URL of your backend API. For local development, it's typically `http://localhost:8000`.

3.  **Run the development server:**

    ```bash
    npm run dev
    ```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

### Building for Production

To create a production-ready build, run:

```bash
npm run build
```

### Running in Production

To start the application in production mode, run:

```bash
npm start
```
