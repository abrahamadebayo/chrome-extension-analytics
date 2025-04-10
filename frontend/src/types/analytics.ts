export interface AnalyticsData {
  datetime_visited: string;
  url: string;
  link_count: number;
  word_count: number;
  image_count: number;
  total_visits: number;
}

export interface Visit extends AnalyticsData {
  // If Visit needs additional properties beyond AnalyticsData, add them here
}

export interface AnalyticsState {
  currentData: AnalyticsData | null;
  visitHistory: Visit[];
  loading: boolean;
  error: string | null;
}

export type AnalyticsActionType = 
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: { current: AnalyticsData | null, history: Visit[] } }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'RESET' };
