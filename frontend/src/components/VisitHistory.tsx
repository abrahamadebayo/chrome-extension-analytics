import React, { useState } from 'react';

export interface Visit {
  datetime_visited: string;
  url: string;
  link_count: number;
  word_count: number;
  image_count: number;
  total_visits: number;
}

interface VisitHistoryProps {
  history: Visit[];
}

const VisitHistory: React.FC<VisitHistoryProps> = ({ history }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter history based on search term
  const filteredHistory = history.filter(visit => 
    visit.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="visit-history card">
      <h2>
        Visit History
        <span style={{ fontSize: '0.9em', fontWeight: 'normal' }}>
          {history.length} visits
        </span>
      </h2>
      
      <div className="search-box">
        <span className="search-icon">🔍</span>
        <input 
          type="text"
          placeholder="Search by URL..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {filteredHistory.length > 0 ? (
        <ul className="visit-history-list">
          {filteredHistory.map((visit, index) => (
            <li key={index} className="visit-history-item">
              <div className="visit-history-item-header">
                <span className="visit-history-date">
                  {new Date(visit.datetime_visited).toLocaleString()}
                </span>
                <span className="visit-history-total">
                  {visit.total_visits} visits
                </span>
              </div>
              
              <div className="visit-history-url">
                {visit.url}
              </div>
              
              <div className="visit-history-metrics">
                <div className="visit-history-metric">
                  <div className="visit-history-metric-value">{visit.link_count}</div>
                  <div>Links</div>
                </div>
                <div className="visit-history-metric">
                  <div className="visit-history-metric-value">{visit.word_count}</div>
                  <div>Words</div>
                </div>
                <div className="visit-history-metric">
                  <div className="visit-history-metric-value">{visit.image_count}</div>
                  <div>Images</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-state">
          {searchTerm ? (
            <p>No visits match your search for "{searchTerm}"</p>
          ) : (
            <p>No visit history available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default VisitHistory;