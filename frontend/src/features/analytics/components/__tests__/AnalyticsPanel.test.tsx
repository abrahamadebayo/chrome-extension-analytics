import React from 'react';
import { render, screen } from '@testing-library/react';
import AnalyticsPanel from '../AnalyticsPanel';
import { AnalyticsData } from '../../../../types/analytics';

describe('AnalyticsPanel', () => {
  const mockData: AnalyticsData = {
    datetime_visited: '2023-05-15T14:30:00Z',
    url: 'https://example.com',
    link_count: 15,
    word_count: 500,
    image_count: 3,
    total_visits: 5
  };

  test('renders analytics data correctly', () => {
    render(<AnalyticsPanel data={mockData} />);
    
    // Check if metrics are displayed (could be rendered as text or within elements)
    expect(screen.getByText('15')).toBeInTheDocument(); 
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    
    // URL might be displayed in various ways, so we'll check for partial content
    expect(screen.getByText(/example.com/)).toBeInTheDocument();
    
    // Check if the visit count appears somewhere
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
