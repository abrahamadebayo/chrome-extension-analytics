# Chrome Extension Analytics Project

This project is a Chrome extension that provides analytics on web pages visited by the user. It consists of a FastAPI backend for data storage and processing, and a React-based frontend that displays analytics (current page metrics and visit history) in a side panel.

## Project Structure

```
chrome-extension-analytics
├── backend
│   ├── app
│   │   ├── api
│   │   │   ├── v1
│   │   │   │   ├── endpoints
│   │   │   │   │   └── analytics.py   # Analytics API endpoints (create/update, current metrics, history)
│   │   │   │   └── __init__.py
│   │   │   └── __init__.py
│   │   ├── database.py        # Database connection and session management
│   │   ├── main.py            # FastAPI entry point; includes routes and database initialization
│   │   ├── models.py          # SQLAlchemy models for defining database schema
│   │   ├── schemas.py         # Pydantic schemas for request/response validation
│   │   └── __init__.py
│   ├── Dockerfile             # Dockerfile to containerize the FastAPI backend
│   ├── requirements.txt       # Python package dependencies for the backend
│   └── README.md              # Backend-specific instructions
├── frontend
│   ├── build                  # Output folder for the built extension
│   ├── node_modules           # Installed npm dependencies
│   ├── public
│   │   ├── images
│   │   │   └── extension_preview.png  # Screenshot of the extension in action
│   │   ├── background.js      # Background script for handling extension events
│   │   ├── content.js         # Content script for extracting page metrics
│   │   ├── icon.png           # Extension icon
│   │   ├── index.html         # HTML file for the popup UI
│   │   └── manifest.json      # Chrome extension manifest
│   ├── src
│   │   ├── components
│   │   │   ├── AnalyticsPanel.tsx  # Displays current page metrics
│   │   │   └── VisitHistory.tsx    # Lists past visit records
│   │   ├── styles
│   │   │   └── App.css        # Styles for the React application
│   │   ├── App.tsx            # Main React component for the analytics UI
│   │   ├── index.tsx          # Entry point for the React app
│   │   └── react-app-env.d.ts # TypeScript environment definitions
│   ├── package.json           # npm configuration file with build and development scripts
│   ├── tsconfig.json          # TypeScript configuration file
│   └── README.md              # Frontend-specific instructions
├── docker-compose.yml         # Docker Compose configuration to run both backend and PostgreSQL
└── README.md                  # This overall project README
```

## Setup Instructions

### Prerequisites

- **Docker & Docker Compose:** Ensure both are installed on your machine for running the backend and PostgreSQL.
- **Node.js & npm:** Required to build and run the React frontend.

### Backend Setup

1. **Navigate to the backend directory:**

   ```bash
   cd backend
   ```

2. **Build the Docker image (optional):**

   Although the backend is typically run with Docker Compose, you can build the Docker image manually with:

   ```bash
   docker build -t fastapi-backend .
   ```

3. **Run the backend service along with PostgreSQL using Docker Compose:**

   From the root of the project (where `docker-compose.yml` is located), run:

   ```bash
   docker-compose up
   ```

   This command will start the FastAPI backend and the PostgreSQL database. Ensure you can access the FastAPI API (usually at [http://localhost:8000](http://localhost:8000)).

### Frontend Setup

1. **Navigate to the frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Build the React Application:**

   This step bundles your React code and copies static assets (including the manifest.json) into the `build/` folder.

   ```bash
   npm run build
   ```

   After building, your `build/` folder should have a structure similar to:

   ```
   build/
   ├── manifest.json
   ├── background.js
   ├── content.js
   ├── icon.png
   ├── index.html
   ├── static/  (other compiled assets)
   ```

4. **Load the Extension in Chrome:**

   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable **Developer Mode** by toggling the switch in the top-right corner.
   - Click on **"Load unpacked"**.
   - Select the `build` folder (not the `public` folder). The manifest.json must be at the root of this folder.
   - The extension should load without errors.

5. **(Optional) Run the React App in Development Mode:**

   If you prefer to test the React app outside of the Chrome extension context:

   ```bash
   npm start
   ```

   This will start a local development server, which you can access at [http://localhost:3000](http://localhost:3000). Note that changes made here must be rebuilt (`npm run build`) to update the extension.

### Usage

- **Data Collection:**  
  The extension automatically collects page metrics (visit date, URL, counts of links, words, images, and total visit count) on every page visit.

- **Viewing Analytics:**  
  When the extension is active, it displays:
  - **Current Page Metrics:** Detailed analytics for the latest recorded visit.
  - **Visit History:** A list of past visits with timestamps and associated metrics.

- **Backend Dependency:**  
  Ensure that the FastAPI backend (and PostgreSQL) is running; otherwise, the extension will not be able to fetch or store analytics data.

### Chrome Extension Preview

Below is a preview of the Chrome Extension Analytics in action:

![Chrome Extension Preview](frontend/public/images/extension_preview.png)

## Notes

- **No Authentication:**  
  This project is designed for local use only and does not include user authentication.
- **Developer Mode:**  
  The extension must be loaded in Chrome with Developer Mode enabled when using an unpacked extension.
- **Empty Data Handling:**  
  If no analytics data is available, the extension UI will display friendly fallback messages. A 404 response from the backend simply means no page visit has been recorded yet.
- **Environment Consistency:**  
  Make sure the backend API URLs in the frontend code (e.g., `http://localhost:8000/api/analytics/…`) match your deployment settings.
