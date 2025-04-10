import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AnalyticsProvider, useAnalytics } from '../analytics-context';
import { analyticsApi } from '../../../services/api/analytics-api';

// Mock the API service
jest.mock('../../../services/api/analytics-api', () => ({
  analyticsApi: {
    getAllAnalyticsData: jest.fn()
  }
}));

// Test component that uses the context
const TestComponent = () => {
  const { currentData, loading, error } = useAnalytics();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!currentData) return <div>No data</div>;
  
  return <div data-testid="analytics-data">URL: {currentData.url}</div>;
};

describe('AnalyticsContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('shows loading state initially', async () => {
    // Setup the mock to delay response
    (analyticsApi.getAllAnalyticsData as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ current: null, history: [] }), 100))
    );
    
    render(
      <AnalyticsProvider>
        <TestComponent />
      </AnalyticsProvider>
    );
    
    // Initial state should be loading
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('No data')).toBeInTheDocument();
    });
  });
  
  test('displays data when loaded', async () => {
    const mockData = {
      current: {
        datetime_visited: '2023-05-15T14:30:00Z',
        url: 'https://example.com',
        link_count: 15,
        word_count: 500,
        image_count: 3,
        total_visits: 5
      },
      history: []
    };
    
    // Make sure the mock actually resolves with our data
    (analyticsApi.getAllAnalyticsData as jest.Mock).mockImplementation(() => {
      return Promise.resolve(mockData);
    });
    
    // Render with the mocked API response
    render(
      <AnalyticsProvider>
        <TestComponent />
      </AnalyticsProvider>
    );
    
    // First we should see loading
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    // Then we should see our data
    await waitFor(() => {
      const element = screen.getByTestId('analytics-data');
      expect(element).toHaveTextContent('URL: https://example.com');
    }, { timeout: 3000 });
  });
  
  test('shows error when API fails', async () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();
    
    try {
      // Mock a rejected promise
      (analyticsApi.getAllAnalyticsData as jest.Mock).mockImplementation(() => {
        return Promise.reject(new Error('Failed to fetch'));
      });
      
      render(
        <AnalyticsProvider>
          <TestComponent />
        </AnalyticsProvider>
      );
      
      // First we should see loading
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      
      // Then we should see the error
      await waitFor(() => {
        expect(screen.getByText(/Error:/)).toBeInTheDocument();
      });
    } finally {
      // Restore console.error
      console.error = originalError;
    }
  });
});
