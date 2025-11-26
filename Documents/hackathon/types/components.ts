// Dynamic Component Types for AI-Generated Visualizations

export type ComponentType = 'chart' | 'table' | 'matrix' | 'card' | 'timeline';

export interface BaseComponentData {
  type: ComponentType;
  title?: string;
  description?: string;
}

// Chart Component (for market sizing, growth trends, etc.)
export interface ChartComponentData extends BaseComponentData {
  type: 'chart';
  chartType: 'bar' | 'line' | 'pie' | 'funnel' | 'area';
  data: Array<{
    label: string;
    value: number;
    color?: string;
    metadata?: Record<string, any>;
  }>;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

// Table Component (for company lists, comparisons)
export interface TableComponentData extends BaseComponentData {
  type: 'table';
  columns: Array<{
    key: string;
    label: string;
    type?: 'text' | 'number' | 'currency' | 'percentage' | 'link';
  }>;
  rows: Array<Record<string, any>>;
  sortable?: boolean;
  filterable?: boolean;
}

// Matrix Component (for competitive positioning, 2x2 matrices)
export interface MatrixComponentData extends BaseComponentData {
  type: 'matrix';
  xAxis: {
    label: string;
    min: string;
    max: string;
  };
  yAxis: {
    label: string;
    min: string;
    max: string;
  };
  quadrants: {
    topLeft: { label: string; items: Array<{ name: string; x: number; y: number; data?: any }> };
    topRight: { label: string; items: Array<{ name: string; x: number; y: number; data?: any }> };
    bottomLeft: { label: string; items: Array<{ name: string; x: number; y: number; data?: any }> };
    bottomRight: { label: string; items: Array<{ name: string; x: number; y: number; data?: any }> };
  };
}

// Card Component (for company profiles, talent cards)
export interface CardComponentData extends BaseComponentData {
  type: 'card';
  cards: Array<{
    id: string;
    title: string;
    subtitle?: string;
    image?: string;
    metrics?: Array<{ label: string; value: string | number; trend?: 'up' | 'down' | 'neutral' }>;
    tags?: string[];
    description?: string;
    link?: string;
  }>;
  layout?: 'grid' | 'list';
}

// Timeline Component (for funding rounds, company milestones)
export interface TimelineComponentData extends BaseComponentData {
  type: 'timeline';
  events: Array<{
    date: string;
    title: string;
    description?: string;
    type?: 'funding' | 'milestone' | 'launch' | 'acquisition' | 'other';
    amount?: string;
    metadata?: Record<string, any>;
  }>;
  sortOrder?: 'asc' | 'desc';
}

// Union type for all component data
export type ComponentData = 
  | ChartComponentData 
  | TableComponentData 
  | MatrixComponentData 
  | CardComponentData 
  | TimelineComponentData;
