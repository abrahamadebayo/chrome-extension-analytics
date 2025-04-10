import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { analyticsApi, getErrorMessage } from '../services/api';

export interface AnalyticsData {
  datetime_visited: string;
  url: string;
  link_count: number;
  word_count: number;
  image_count: number;
  total_visits: number;
}

export interface Visit {
  datetime_visited: string;
  url: string;
  link_count: number;
  word_count: number;
  image_count: number;
  total_visits: number;
}

interface AnalyticsContextType {
  analyticsData: AnalyticsData | null;
  visitHistory: Visit[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
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

export const AnalyticsProvider = ({ children }: AnalyticsProviderProps) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [visitHistory, setVisitHistory] = useState<Visit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [currentData, historyData] = await Promise.all([
        analyticsApi.getCurrentAnalytics(),
        analyticsApi.getVisitHistory()
      ]);
      
      setAnalyticsData(currentData);
      setVisitHistory(historyData || []);
    } catch (error: any) {
      // Use our enhanced error handling
      setError(error.userMessage || getErrorMessage(error));
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const value = {
    analyticsData,
    visitHistory,
    loading,
    error,
    refreshData: fetchData
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};
