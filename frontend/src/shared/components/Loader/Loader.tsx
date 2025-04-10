import React from 'react';

interface LoaderProps {
  message?: string;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ 
  message = 'Loading analytics data...', 
  className = '' 
}) => {
  return (
    <div className={`loading ${className}`}>
      <div className="loading-spinner" aria-label="Loading" role="status"></div>
      <p>{message}</p>
    </div>
  );
};

export default Loader;
