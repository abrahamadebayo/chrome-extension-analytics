import React, { useState, useMemo } from 'react';
import { Visit } from '../../../types/analytics';
import { useDebounce } from '../../../shared/hooks/useDebounce';

interface VisitHistoryProps {
  history: Visit[];
}

const VisitHistory: React.FC<VisitHistoryProps> = ({ history }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // Debounce search for better performance
  
  const filteredHistory = useMemo(() => {
    if (!debouncedSearchTerm) return history;
    
    return history.filter(item => 
      item.url.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [history, debouncedSearchTerm]);

  return (
    <div className="visit-history card">
      <h2>
        Visit History
        <span style={{ fontSize: '0.9em', fontWeight: 'normal', marginLeft: '8px' }}>
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
          aria-label="Search visits"
        />
      </div>
      
      {filteredHistory.length > 0 ? (
        <ul className="visit-history-list" role="list">
          {filteredHistory.map((item, index) => (
            <li key={`${item.url}-${item.datetime_visited}-${index}`} className="visit-history-item">
              <div className="visit-history-item-header">
                <span className="visit-history-date">
                  {new Date(item.datetime_visited).toLocaleString()}
                </span>
                <span className="visit-history-total">
                  {item.total_visits} {item.total_visits === 1 ? 'visit' : 'visits'}
                </span>
              </div>
              <div className="visit-history-url" title={item.url}>
                {item.url}
              </div>
              <div className="visit-history-metrics">
                <div className="visit-history-metric">
                  <div className="visit-history-metric-value">{item.link_count}</div>
                  <div>Links</div>
                </div>
                <div className="visit-history-metric">
                  <div className="visit-history-metric-value">{item.word_count}</div>
                  <div>Words</div>
                </div>
                <div className="visit-history-metric">
                  <div className="visit-history-metric-value">{item.image_count}</div>
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
