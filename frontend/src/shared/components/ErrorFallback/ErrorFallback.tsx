import React from 'react';
import './ErrorFallback.css';

interface ErrorFallbackProps {
  error: string | null;
  retry?: () => void;
  className?: string;
  details?: string;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  retry, 
  className = '',
  details
}) => {
  if (!error) return null;

  return (
    <div className={`error-fallback card ${className}`} role="alert">
      <div className="error-icon">⚠️</div>
      <h3>Something went wrong</h3>
      <p className="error-message">{error}</p>
      
      {details && (
        <details className="error-details">
          <summary>Technical Details</summary>
          <pre>{details}</pre>
        </details>
      )}
      
      {retry && (
        <button 
          className="retry-button" 
          onClick={retry}
          aria-label="Retry"
          data-testid="retry-button"
        >
          Try Again
        </button>
      )}
      
      <p className="help-text">
        If the problem persists, please make sure the backend server is running at 
        <code>http://localhost:8000</code> and refresh the page.
      </p>
    </div>
  );
};

export default ErrorFallback;
