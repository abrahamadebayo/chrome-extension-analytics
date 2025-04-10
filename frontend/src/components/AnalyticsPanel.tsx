import React from 'react';

export interface AnalyticsData {
  datetime_visited: string;
  url: string;
  link_count: number;
  word_count: number;
  image_count: number;
  total_visits: number;
}

interface AnalyticsPanelProps {
  data: AnalyticsData;
}

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ data }) => {
  return (
    <div className="analytics-panel card">
      <h2>Current Page Analytics</h2>
      
      <div className="metric-highlight">
        <div className="metric-item">
          <div className="metric-value">{data.link_count}</div>
          <div className="metric-label">Links</div>
        </div>
        <div className="metric-item">
          <div className="metric-value">{data.word_count}</div>
          <div className="metric-label">Words</div>
        </div>
        <div className="metric-item">
          <div className="metric-value">{data.image_count}</div>
          <div className="metric-label">Images</div>
        </div>
      </div>
      
      <div className="analytics-details">
        <div className="analytics-field">
          <span className="analytics-label">Last Updated</span>
          <span className="analytics-value">{new Date(data.datetime_visited).toLocaleString()}</span>
        </div>
        <div className="analytics-field">
          <span className="analytics-label">Total Visits</span>
          <span className="analytics-value">{data.total_visits}</span>
        </div>
        <div className="analytics-field">
          <span className="analytics-label">URL</span>
          <span className="analytics-value" style={{ wordBreak: 'break-all' }}>{data.url}</span>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;