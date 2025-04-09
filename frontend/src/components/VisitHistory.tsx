import React from 'react';

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
  return (
    <div className="visit-history">
      <h2>Visit History</h2>
      {history.length > 0 ? (
        <ul className="visit-history-list">
          {history.map((visit, index) => (
            <li key={index} className="visit-history-item">
              <div className="visit-history-item-header">
                <span className="visit-history-date">
                  {new Date(visit.datetime_visited).toLocaleString()}
                </span>
                <span className="visit-history-total">
                  Total Visits: {visit.total_visits}
                </span>
              </div>
              <div className="visit-history-item-body">
                <p>
                  <strong>URL:</strong> {visit.url}
                </p>
                <p>
                  <strong>Links:</strong> {visit.link_count}
                </p>
                <p>
                  <strong>Words:</strong> {visit.word_count}
                </p>
                <p>
                  <strong>Images:</strong> {visit.image_count}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No visit history available.</p>
      )}
    </div>
  );
};

export default VisitHistory;
