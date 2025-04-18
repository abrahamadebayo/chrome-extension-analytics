import React, { useState } from 'react';
import { AnalyticsProvider, useAnalytics } from './features/analytics/analytics-context';
import AnalyticsPanel from './features/analytics/components/AnalyticsPanel';
import VisitHistory from './features/history/components/VisitHistory';
import Tabs from './shared/components/Tabs/Tabs';
import Loader from './shared/components/Loader/Loader';
import ErrorFallback from './shared/components/ErrorFallback/ErrorFallback';
import './styles/App.css';
import { analyticsApi } from './services/api/analytics-api';

const AnalyticsTabs = [
  { id: 'metrics', label: 'Current Metrics' },
  { id: 'history', label: 'Visit History' },
];

/**
 * Main app component with tab navigation
 */
const AnalyticsApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('metrics');
  const { currentData, visitHistory, loading, error, refreshData } = useAnalytics();

  const handleRefresh = () => {
    refreshData(true); // Force refresh from server
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete the history?')) {
      try {
        await analyticsApi.deleteAllHistory();
        alert('History deleted successfully');
        refreshData(true); // Refresh data after deletion
      } catch (error) {
        console.error('Error deleting history:', error);
        alert('Failed to delete history. Please try again.');
      }
    }
  }

  // Use process.env.NODE_ENV instead of import.meta.env.DEV
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="App">
      <header className="app-header">
        <h1>Chrome Analytics</h1>
        <button 
          className="refresh-button" 
          onClick={handleRefresh}
          disabled={loading}
          aria-label="Refresh data"
          title="Refresh data"
        >
          ↻
        </button>
        <button 
          className="delete-button danger"
          onClick={handleDelete}
          aria-label="Delete all history"
          title="Delete all history"
          disabled={loading || visitHistory.length === 0}
        >
          <span role="img" aria-hidden="true">🗑️</span>
        </button>
      </header>
      
      <Tabs 
        tabs={AnalyticsTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      {error && (
        <ErrorFallback 
          error={error} 
          retry={() => refreshData(true)}
          details={isDevelopment ? `Failed to load data from API: ${error}` : undefined}
        />
      )}
      
      {loading ? (
        <Loader />
      ) : !error && (
        <>
          {activeTab === 'metrics' && (
            currentData ? (
              <AnalyticsPanel data={currentData} />
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

// Root component with providers
const App: React.FC = () => {
  return (
    <AnalyticsProvider>
      <AnalyticsApp />
    </AnalyticsProvider>
  );
};

export default App;