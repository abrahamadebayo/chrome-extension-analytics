import React, { useState } from 'react';
import { AnalyticsProvider, useAnalytics } from './features/analytics/analytics-context';
import AnalyticsPanel from './features/analytics/components/AnalyticsPanel';
import VisitHistory from './features/history/components/VisitHistory';
import Tabs from './shared/components/Tabs/Tabs';
import Loader from './shared/components/Loader/Loader';
import ErrorFallback from './shared/components/ErrorFallback/ErrorFallback';
import './styles/App.css';

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
          details={import.meta.env.DEV ? `Failed to load data from API: ${error}` : undefined}
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