// Consulting WorkStreams - Optimized for Hackathon Demo
// Focus: Crustdata enrichment + ChatGPT generation + Visual components

export interface WorkStreamTask {
  id: number;
  title: string;
  description?: string;
}

export interface WorkStream {
  id: string;
  title: string;
  description: string;
  icon: string;
  taskCount: number;
  category: 'intelligence' | 'analysis' | 'visualization';
  tags: string[];
  prompt: string;
  tasks: WorkStreamTask[];
  generatesComponent?: 'chart' | 'table' | 'matrix' | 'card' | 'timeline';
}

export const WORKSTREAMS: WorkStream[] = [
  // Real-Time Intelligence Workflows
  {
    id: 'company-screener',
    title: 'Company Intelligence Screener',
    description: 'Find and analyze companies with real-time Crustdata + AI insights',
    icon: '🎯',
    taskCount: 4,
    category: 'intelligence',
    tags: ['Crustdata', 'Real-time', 'Company Research'],
    prompt: 'Find tech companies in San Francisco with 50-200 employees, 20%+ growth, and analyze their market position.',
    generatesComponent: 'table',
    tasks: [
      { id: 1, title: 'Screen companies with Crustdata', description: 'Use real-time filters for growth, location, size' },
      { id: 2, title: 'Enrich company data', description: 'Get detailed financials, team, and metrics' },
      { id: 3, title: 'AI analysis', description: 'ChatGPT analyzes patterns and opportunities' },
      { id: 4, title: 'Generate interactive table', description: 'Sortable, filterable company list' }
    ]
  },
  {
    id: 'competitive-matrix',
    title: 'Competitive Intelligence Matrix',
    description: 'Real-time competitor analysis with 2x2 positioning matrix',
    icon: '⚔️',
    taskCount: 4,
    category: 'analysis',
    tags: ['Competitive', 'Matrix', 'Positioning'],
    prompt: 'Analyze competitors in the AI SaaS space. Create a 2x2 matrix showing market position and generate strategic insights.',
    generatesComponent: 'matrix',
    tasks: [
      { id: 1, title: 'Identify competitors', description: 'Use Crustdata to find similar companies' },
      { id: 2, title: 'Gather competitive data', description: 'Enrich with growth, funding, team size' },
      { id: 3, title: 'AI positioning analysis', description: 'ChatGPT analyzes market positioning' },
      { id: 4, title: 'Generate 2x2 matrix', description: 'Interactive competitive landscape visual' }
    ]
  },
  {
    id: 'market-sizing',
    title: 'Market Sizing Calculator',
    description: 'Calculate TAM/SAM/SOM with real data and generate visual breakdown',
    icon: '📊',
    taskCount: 5,
    category: 'analysis',
    tags: ['Market Sizing', 'TAM/SAM/SOM', 'Charts'],
    prompt: 'Size the market for AI-powered customer service tools in North America. Show TAM, SAM, SOM with visual breakdown.',
    generatesComponent: 'chart',
    tasks: [
      { id: 1, title: 'Define market scope', description: 'AI clarifies boundaries and segments' },
      { id: 2, title: 'Gather market data', description: 'Crustdata provides company counts and metrics' },
      { id: 3, title: 'Calculate TAM/SAM/SOM', description: 'AI performs calculations with methodology' },
      { id: 4, title: 'Generate funnel chart', description: 'Visual market sizing breakdown' },
      { id: 5, title: 'Provide strategic insights', description: 'AI interprets what the numbers mean' }
    ]
  },
  {
    id: 'talent-pipeline',
    title: 'Talent Pipeline Builder',
    description: 'Find and analyze talent with real-time people data',
    icon: '👥',
    taskCount: 4,
    category: 'intelligence',
    tags: ['Talent', 'Recruiting', 'People'],
    prompt: 'Find senior engineers at FAANG companies with AI/ML expertise in the Bay Area. Create a talent pipeline.',
    generatesComponent: 'card',
    tasks: [
      { id: 1, title: 'Search for talent', description: 'Crustdata people search with filters' },
      { id: 2, title: 'Enrich profiles', description: 'Get detailed work history and skills' },
      { id: 3, title: 'AI candidate analysis', description: 'ChatGPT evaluates fit and experience' },
      { id: 4, title: 'Generate candidate cards', description: 'Visual profile cards with insights' }
    ]
  },
  {
    id: 'funding-tracker',
    title: 'Funding & Growth Tracker',
    description: 'Track funding rounds and company growth signals in real-time',
    icon: '💰',
    taskCount: 4,
    category: 'intelligence',
    tags: ['Funding', 'Growth', 'Signals'],
    prompt: 'Track recent funding rounds in the fintech sector. Show growth trends and investment patterns.',
    generatesComponent: 'timeline',
    tasks: [
      { id: 1, title: 'Find funded companies', description: 'Crustdata filters for recent funding' },
      { id: 2, title: 'Analyze growth signals', description: 'Headcount, hiring, market signals' },
      { id: 3, title: 'AI pattern recognition', description: 'ChatGPT identifies trends and insights' },
      { id: 4, title: 'Generate timeline', description: 'Visual funding and growth timeline' }
    ]
  },
  {
    id: 'company-deep-dive',
    title: 'Company Deep Dive Report',
    description: 'Comprehensive company analysis with multiple data sources',
    icon: '🔬',
    taskCount: 6,
    category: 'analysis',
    tags: ['Research', 'Deep Dive', 'Comprehensive'],
    prompt: 'Conduct a deep dive on Stripe. Include team analysis, growth metrics, market position, and strategic insights.',
    generatesComponent: 'card',
    tasks: [
      { id: 1, title: 'Enrich company data', description: 'Crustdata comprehensive company info' },
      { id: 2, title: 'Analyze team', description: 'Leadership and key employees' },
      { id: 3, title: 'Growth metrics', description: 'Headcount, funding, market signals' },
      { id: 4, title: 'Social presence', description: 'LinkedIn posts and engagement' },
      { id: 5, title: 'AI strategic analysis', description: 'ChatGPT synthesizes all data' },
      { id: 6, title: 'Generate report card', description: 'Visual summary with key metrics' }
    ]
  },
  {
    id: 'market-landscape',
    title: 'Market Landscape Overview',
    description: 'Visual market map with key players and segments',
    icon: '🗺️',
    taskCount: 5,
    category: 'visualization',
    tags: ['Market Map', 'Landscape', 'Overview'],
    prompt: 'Create a market landscape for the AI infrastructure space. Show key players, segments, and market dynamics.',
    generatesComponent: 'matrix',
    tasks: [
      { id: 1, title: 'Identify market segments', description: 'AI categorizes the market' },
      { id: 2, title: 'Find key players', description: 'Crustdata screens for companies' },
      { id: 3, title: 'Categorize companies', description: 'AI assigns to segments' },
      { id: 4, title: 'Analyze dynamics', description: 'Growth, funding, competition' },
      { id: 5, title: 'Generate market map', description: 'Visual landscape with positioning' }
    ]
  },
  {
    id: 'growth-analysis',
    title: 'Growth Metrics Dashboard',
    description: 'Track and visualize company growth indicators',
    icon: '📈',
    taskCount: 4,
    category: 'visualization',
    tags: ['Growth', 'Metrics', 'Dashboard'],
    prompt: 'Analyze growth metrics for top SaaS companies. Show headcount growth, funding, and market signals over time.',
    generatesComponent: 'chart',
    tasks: [
      { id: 1, title: 'Select companies', description: 'Crustdata screens for SaaS leaders' },
      { id: 2, title: 'Gather growth data', description: 'Headcount, funding, signals' },
      { id: 3, title: 'AI trend analysis', description: 'ChatGPT identifies patterns' },
      { id: 4, title: 'Generate growth charts', description: 'Interactive growth visualizations' }
    ]
  }
];

// Group WorkStreams by category
export const WORKSTREAM_CATEGORIES = {
  intelligence: {
    title: 'Real-Time Intelligence',
    description: 'Live company and people data with AI analysis',
    icon: '🎯'
  },
  analysis: {
    title: 'Strategic Analysis',
    description: 'Deep analysis with AI-powered insights',
    icon: '🔍'
  },
  visualization: {
    title: 'Visual Reports',
    description: 'Interactive charts and visual deliverables',
    icon: '📊'
  }
};

// Quick starters for hackathon demo
export const QUICK_STARTERS = [
  "Find fast-growing AI companies in SF with 50-200 employees",
  "Create a competitive matrix for AI SaaS companies",
  "Size the market for AI customer service tools",
  "Find senior ML engineers at Google and Meta",
  "Track recent Series A funding in fintech",
  "Deep dive analysis on Stripe's growth and team"
];
