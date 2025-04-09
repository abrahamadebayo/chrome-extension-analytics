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
    <div className="analytics-panel">
      <h2>Current Page Metrics</h2>
      <div className="analytics-details">
        <div className="analytics-field">
          <span className="analytics-label">Last Updated:</span>
          <span className="analytics-value">{new Date(data.datetime_visited).toLocaleString()}</span>
        </div>
        <div className="analytics-field">
          <span className="analytics-label">URL:</span>
          <span className="analytics-value">{data.url}</span>
        </div>
        <div className="analytics-field">
          <span className="analytics-label">Links Count:</span>
          <span className="analytics-value">{data.link_count}</span>
        </div>
        <div className="analytics-field">
          <span className="analytics-label">Words Count:</span>
          <span className="analytics-value">{data.word_count}</span>
        </div>
        <div className="analytics-field">
          <span className="analytics-label">Images Count:</span>
          <span className="analytics-value">{data.image_count}</span>
        </div>
        <div className="analytics-field">
          <span className="analytics-label">Total Visits:</span>
          <span className="analytics-value">{data.total_visits}</span>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
