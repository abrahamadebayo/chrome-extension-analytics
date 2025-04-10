import { analyticsApi } from '../analytics-api';
import { apiClient } from '../api-client';

// Mock the axios client
jest.mock('../api-client', () => ({
  apiClient: {
    get: jest.fn()
  }
}));

describe('analyticsApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('getCurrentAnalytics', () => {
    test('returns data when request is successful', async () => {
      const mockResponse = {
        data: {
          datetime_visited: '2023-05-15T14:30:00Z',
          url: 'https://example.com',
          link_count: 15,
          word_count: 500,
          image_count: 3,
          total_visits: 5
        }
      };
      
      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);
      
      const result = await analyticsApi.getCurrentAnalytics();
      
      expect(apiClient.get).toHaveBeenCalledWith('/analytics/current');
      expect(result).toEqual(mockResponse.data);
    });
    
    test('returns null when 404 error occurs', async () => {
      const error = new Error('Not found');
      Object.defineProperty(error, 'response', { value: { status: 404 } });
      Object.defineProperty(error, 'isAxiosError', { value: true });
      
      (apiClient.get as jest.Mock).mockRejectedValue(error);
      
      const result = await analyticsApi.getCurrentAnalytics();
      
      expect(result).toBeNull();
    });
    
    test('propagates other errors', async () => {
      const error = new Error('Server error');
      Object.defineProperty(error, 'response', { value: { status: 500 } });
      Object.defineProperty(error, 'isAxiosError', { value: true });
      
      (apiClient.get as jest.Mock).mockRejectedValue(error);
      
      await expect(analyticsApi.getCurrentAnalytics()).rejects.toThrow();
    });
  });
});
