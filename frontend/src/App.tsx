import React, { useEffect, useState } from 'react';
import AnalyticsPanel from './components/AnalyticsPanel';
import VisitHistory from './components/VisitHistory';

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

const App: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [visitHistory, setVisitHistory] = useState<Visit[]>([]);

  useEffect(() => {
    // Fetch current analytics data
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/analytics/current');
        if (response.status === 404) {
          console.warn("No current metrics available.");
          setAnalyticsData(null);
          return;
        }
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAnalyticsData(data);
      } catch (error) {
        console.error("Error fetching current metrics:", error);
        setAnalyticsData(null);
      }
    };

    // Fetch visit history data
    const fetchHistory = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/analytics/history');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setVisitHistory(data);
      } catch (error) {
        console.error("Error fetching visit history:", error);
        setVisitHistory([]);
      }
    };

    fetchAnalytics();
    fetchHistory();
  }, []);

  return (
    <div className="App">
      <h1>Chrome Extension Analytics</h1>
      {analyticsData ? (
        <AnalyticsPanel data={analyticsData} />
      ) : (
        <p>No current analytics data available.</p>
      )}
      {visitHistory.length > 0 ? (
        <VisitHistory history={visitHistory} />
      ) : (
        <p>No visit history available.</p>
      )}
    </div>
  );
};

export default App;
