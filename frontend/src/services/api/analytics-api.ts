import { apiClient } from './api-client';
import { AnalyticsData, Visit } from '../../types/analytics';
import { AxiosError } from 'axios';

/**
 * Analytics API service with improved error handling
 */
export const analyticsApi = {
  /**
   * Fetch current page analytics data
   */
  getCurrentAnalytics: async (): Promise<AnalyticsData | null> => {
    try {
      const response = await apiClient.get<AnalyticsData>('/analytics/current');
      return response.data;
    } catch (error) {
      // Fix type checking for error object
      if (error && 
          typeof error === 'object' && 
          'status' in error && 
          error.status === 404) {
        return null;
      }
      
      // Handle 404 responses specifically (for Axios errors)
      if (error instanceof Error && 'isAxiosError' in error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 404) {
          return null;
        }
      }
      
      throw error;
    }
  },
  
  /**
   * Fetch visit history data
   */
  getVisitHistory: async (): Promise<Visit[]> => {
    try {
      const response = await apiClient.get<Visit[]>('/analytics/history');
      return response.data;
    } catch (error) {
      // Fix type checking for error object
      if (error && 
          typeof error === 'object' && 
          'status' in error && 
          error.status === 404) {
        return [];
      }
      
      // Handle 404 responses specifically (for Axios errors)
      if (error instanceof Error && 'isAxiosError' in error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 404) {
          return [];
        }
      }
      
      throw error;
    }
  },
  
  /**
   * Fetch both current analytics and history data in parallel
   * @param forceRefresh - Optional parameter to bypass caching if implemented
   */
  getAllAnalyticsData: async (forceRefresh = false): Promise<{
    current: AnalyticsData | null;
    history: Visit[];
  }> => {
    // We're not using forceRefresh yet but keeping the parameter for future implementation
    // of caching mechanisms. This fixes the TypeScript error.
    const [current, history] = await Promise.all([
      analyticsApi.getCurrentAnalytics(),
      analyticsApi.getVisitHistory()
    ]);
    
    return { current, history };
  },

  deleteAllHistory: async (): Promise<{ status: string; message: string; data?: any }> => {
    try {
      // Try the alternative endpoint if the main one is giving 405 errors
      const response = await apiClient.delete('/analytics/delete-all');
      return response.data;
    } catch (error) {
      console.error('Failed to delete history (first attempt):', error);
      
      try {
        // Fallback to test endpoint if needed
        const testResponse = await apiClient.delete('/test-delete');
        console.log('Test delete response:', testResponse);
        
        // Try original endpoint again
        const response = await apiClient.delete('/analytics/history');
        return response.data;
      } catch (secondError) {
        console.error('Failed to delete history (all attempts):', secondError);
        throw error;
      }
    }
  },

};
