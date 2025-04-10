# Chrome Extension Analytics - Frontend README

This README provides instructions and information specific to the frontend of the Chrome Extension Analytics project.

## Project Structure

The frontend is built using React with TypeScript and follows a feature-based architecture:

- **`src/features/`**: Contains feature-specific modules
  - **`analytics/`**: Analytics feature components and logic
  - **`history/`**: Visit history feature components and logic
- **`src/shared/`**: Shared components, hooks, and utilities
- **`src/services/`**: API and other services
  - **`api/`**: API client and endpoint implementations
- **`src/types/`**: TypeScript type definitions
- **`src/styles/`**: Global styles for the application
- **`public/manifest.json`**: Chrome extension metadata, permissions, and background scripts

## Key Components and Services

- **API Services**: Using Axios with interceptors for robust error handling
- **State Management**: Context API with useReducer for efficient state management
- **Error Handling**: Comprehensive error handling with user-friendly fallbacks
- **Responsive UI**: Modern design with responsive elements and accessibility features

## Setup Instructions

1. **Install Dependencies**:
   Navigate to the `frontend` directory and run the following command:
   ```
   npm install
   ```

2. **Build the Extension**:
   To build the extension for production, run:
   ```
   npm run build
   ```

3. **Load the Extension in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" using the toggle in the top right corner
   - Click on "Load unpacked" and select the `frontend/build` directory

4. **Run the Development Server**:
   For active development with hot reloading:
   ```
   npm start
   ```
   This will start a local development server at `http://localhost:3000`

## Features

The Chrome Extension Analytics dashboard provides:

- **Real-time Analytics**: View metrics for the current page including links, words, and images
- **Visit History**: Browse through your past page visits with timestamps and analytics
- **Search Functionality**: Filter visit history by URL
- **Offline Capability**: Graceful handling of network errors and connectivity issues
- **Refresh Data**: Manually refresh analytics data with a single click

## Error Handling

The application includes comprehensive error handling:

- User-friendly error messages for different error types
- Automatic retry mechanisms
- Detailed technical information in development mode
- Clear instructions for common issues

## Backend Communication

The frontend communicates with a FastAPI backend service:

- RESTful API endpoints for analytics data
- Robust error handling for network and server issues
- Data caching to minimize API requests

## Chrome Extension Preview

Below is a preview of the Chrome Extension Analytics in action:

![Chrome Extension Preview](public/images/extension-preview.png)

## Testing

The project includes a comprehensive test suite built with React Testing Library and Jest:

- **Unit Tests**: Test individual components and utilities
- **Integration Tests**: Test feature interactions
- **API Mocking**: Mock API responses for deterministic tests

### Running Tests

To run the test suite:

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode 
npm test -- --watch
```

### Test Coverage

We maintain high test coverage across critical application paths:

- API Services: Request handling and error management
- Context Providers: State management and data flow
- UI Components: Rendering and user interactions
- Error Handling: Fallbacks and recovery mechanisms

### Testing Architecture

Tests are organized alongside the components they verify:
```
├── features/
│   ├── analytics/
│   │   ├── components/
│   │   │   ├── __tests__/         # Component tests
│   │   ├── __tests__/             # Feature tests
├── services/
│   ├── api/
│   │   ├── __tests__/             # API service tests
```

## Requirements

- Node.js v14+ and npm v6+ (or yarn)
- Chrome browser (latest version recommended)
- FastAPI backend running on `http://localhost:8000`

## Notes

- The FastAPI backend must be running and accessible for the frontend to fetch data
- This project is intended for local use and development purposes
- All analytics data is stored locally and not shared with any external services

For issues or contributions, please refer to the main project repository.