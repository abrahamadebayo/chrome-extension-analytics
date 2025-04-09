# Chrome Extension Analytics - Frontend README

This README provides instructions and information specific to the frontend of the Chrome Extension Analytics project.

## Project Structure

The frontend is built using React and consists of the following key files:

- `public/manifest.json`: Contains metadata for the Chrome extension, including permissions and background scripts.
- `src/App.tsx`: The main component that renders the analytics panel and visit history.
- `src/index.tsx`: The entry point for the React application, rendering the App component into the DOM.
- `src/components/AnalyticsPanel.tsx`: Displays analytics for the current page.
- `src/components/VisitHistory.tsx`: Lists past visits with timestamps.
- `src/styles/App.css`: Contains styles for the React application.
- `package.json`: Configuration file for npm, listing dependencies and scripts.
- `tsconfig.json`: TypeScript configuration file.

## Setup Instructions

1. **Install Dependencies**:
   Navigate to the `frontend` directory and run the following command to install the necessary dependencies:
   ```
   npm install
   ```

2. **Build the Extension**:
   To build the extension for development, run:
   ```
   npm run build
   ```

3. **Load the Extension in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable "Developer mode" using the toggle in the top right corner.
   - Click on "Load unpacked" and select the `frontend/build` directory.

4. **Run the Development Server** (optional):
   If you want to run the React app in development mode, execute:
   ```
   npm start
   ```
   This will start a local development server. You can access the app at `http://localhost:3000`.

## Usage

Once the extension is loaded in Chrome, it will display a side panel showing:
- The last visit date to the current webpage.
- Basic analytics including the number of links, words, and images on the page.
- A list of past visits with timestamps.

## Chrome Extension Preview

Below is a preview of the Chrome Extension Analytics in action:

![Chrome Extension Preview](public/images/extension-preview.png)

## Notes

- Ensure that the FastAPI backend is running and accessible for the frontend to fetch and store data.
- This project is intended for local use only and does not require authentication or user accounts.

For any issues or contributions, please refer to the main project repository.