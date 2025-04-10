import React, { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import { analyticsApi } from '../../services/api/analytics-api';
import { AnalyticsState, AnalyticsActionType } from '../../types/analytics';
import { ApiError } from '../../services/api/api-client';

const initialState: AnalyticsState = {
  currentData: null,
  visitHistory: [],
  loading: true,
  error: null,
};

// Reducer function for analytics state management
const analyticsReducer = (state: AnalyticsState, action: AnalyticsActionType): AnalyticsState => {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        currentData: action.payload.current,
        visitHistory: action.payload.history,
        error: null,
      };
    case 'FETCH_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

interface AnalyticsContextType extends AnalyticsState {
  refreshData: (forceRefresh?: boolean) => Promise<void>;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

interface AnalyticsProviderProps {
  children: ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(analyticsReducer, initialState);

  const fetchData = useCallback(async (forceRefresh = false) => {
    dispatch({ type: 'FETCH_START' });
    
    try {
      const { current, history } = await analyticsApi.getAllAnalyticsData(forceRefresh);
      
      dispatch({
        type: 'FETCH_SUCCESS',
        payload: { current, history }
      });
    } catch (error: any) {
      let errorMessage = 'An unexpected error occurred';
      
      // Handle ApiError from our custom error handler
      if (error && typeof error === 'object' && 'isAxiosError' in error) {
        errorMessage = error.message || 'Failed to connect to analytics server';
        
        // Add specific messages for different error types
        if (error.type === 'NETWORK_ERROR') {
          errorMessage = 'Cannot connect to analytics server. Please check your network connection.';
        } else if (error.type === 'SERVER_ERROR') {
          errorMessage = 'The analytics server encountered an error. Please try again later.';
        }
      }
      
      dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
      console.error("Error fetching analytics data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
    
    // Add auto-refresh if needed
    // const intervalId = setInterval(() => fetchData(), 60000); // Refresh every minute
    // return () => clearInterval(intervalId);
  }, [fetchData]);

  const value = {
    ...state,
    refreshData: fetchData
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};
