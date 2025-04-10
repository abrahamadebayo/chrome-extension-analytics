import React, { useEffect, useState } from 'react';
import AnalyticsPanel from './components/AnalyticsPanel';
import VisitHistory from './components/VisitHistory';
import './styles/App.css';

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
  const [activeTab, setActiveTab] = useState<'metrics' | 'history'>('metrics');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [visitHistory, setVisitHistory] = useState<Visit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch current analytics data
        const metricsResponse = await fetch('http://localhost:8000/api/analytics/current');
        if (metricsResponse.status !== 404) {
          if (!metricsResponse.ok) {
            throw new Error(`HTTP error! status: ${metricsResponse.status}`);
          }
          const metricsData = await metricsResponse.json();
          setAnalyticsData(metricsData);
        }
        
        // Fetch visit history data
        const historyResponse = await fetch('http://localhost:8000/api/analytics/history');
        if (!historyResponse.ok && historyResponse.status !== 404) {
          throw new Error(`HTTP error! status: ${historyResponse.status}`);
        }
        if (historyResponse.status !== 404) {
          const historyData = await historyResponse.json();
          setVisitHistory(historyData);
        }
      } catch (error: any) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="App">
      <h1>Chrome Analytics</h1>
      
      <div className="tabs">
        <div 
          className={`tab ${activeTab === 'metrics' ? 'active' : ''}`}
          onClick={() => setActiveTab('metrics')}
        >
          Current Metrics
        </div>
        <div 
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Visit History
        </div>
      </div>
      
      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading analytics data...</p>
        </div>
      ) : error ? (
        <div className="card">
          <p>Error: {error}</p>
          <p>Please make sure the backend server is running.</p>
        </div>
      ) : (
        <>
          {activeTab === 'metrics' && (
            analyticsData ? (
              <AnalyticsPanel data={analyticsData} />
            ) : (
              <div className="card empty-state">
                <p>No analytics data available for the current page.</p>
                <p>Visit some pages to collect analytics.</p>
              </div>
            )
          )}
          
          {activeTab === 'history' && (
            <VisitHistory history={visitHistory} />
          )}
        </>
      )}
    </div>
  );
};

export default App;