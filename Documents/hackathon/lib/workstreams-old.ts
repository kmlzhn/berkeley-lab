// Consulting WorkStreams - AI-powered workflows for consulting firms
// Inspired by Kenley.ai

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
  category: 'diligence' | 'strategy' | 'operations' | 'pricing' | 'analytics';
  tags: string[];
  prompt: string; // Suggested starter prompt
  tasks: WorkStreamTask[]; // List of tasks for this workflow
}

export const WORKSTREAMS: WorkStream[] = [
  // Due Diligence & Research
  {
    id: 'rcd',
    title: 'Rapid Commercial Diligence (RCD)',
    description: 'Fast-track market analysis and competitive positioning for M&A targets',
    icon: '🔍',
    taskCount: 8,
    category: 'diligence',
    tags: ['M&A', 'Market Research', 'Competitive Analysis'],
    prompt: 'Help me conduct commercial due diligence on [Company Name]. I need market sizing, competitive landscape, and growth potential analysis.',
    tasks: [
      { id: 1, title: 'Prepare a Company Overview', description: 'Research and summarize company background, business model, and key financials' },
      { id: 2, title: 'Summarize Relevant Credentials', description: 'Identify management team expertise and track record' },
      { id: 3, title: 'Find Internal Experts', description: 'Locate subject matter experts within the firm' },
      { id: 4, title: 'Draft Market Sizing', description: 'Calculate TAM, SAM, SOM for target market' },
      { id: 5, title: 'Map Competitive Landscape', description: 'Identify key competitors and market positioning' },
      { id: 6, title: 'Assess Growth Potential', description: 'Analyze growth drivers and expansion opportunities' },
      { id: 7, title: 'Identify Risk Factors', description: 'Document operational, financial, and market risks' },
      { id: 8, title: 'Draft a Deck Outline', description: 'Create presentation structure with key findings' },
    ]
  },
  {
    id: 'competitive-landscape',
    title: 'Competitive Landscape & Battlecards',
    description: 'Map competitors and build strategic battlecards for sales enablement',
    icon: '⚔️',
    taskCount: 5,
    category: 'strategy',
    tags: ['Competitive Intelligence', 'Market Positioning', 'Sales'],
    prompt: 'Build a competitive landscape analysis for [Industry/Market]. Include key players, positioning, strengths/weaknesses, and battlecards.',
    tasks: [
      { id: 1, title: 'Identify Top Competitors', description: 'Research and list 10-15 key competitors in the market' },
      { id: 2, title: 'Analyze Positioning & Value Props', description: 'Document how each competitor positions themselves' },
      { id: 3, title: 'Map Strengths & Weaknesses', description: 'SWOT analysis for each major competitor' },
      { id: 4, title: 'Create Battlecards', description: 'Build sales battlecards with win strategies' },
      { id: 5, title: 'Draft Competitive Summary', description: 'Executive summary with strategic recommendations' },
    ]
  },
  {
    id: 'market-sizing',
    title: 'Market Sizing & TAM/SAM/SOM Builder',
    description: 'Calculate addressable market size with bottom-up and top-down approaches',
    icon: '📊',
    taskCount: 13,
    category: 'strategy',
    tags: ['Market Sizing', 'TAM/SAM/SOM', 'Strategy'],
    prompt: 'Help me size the market for [Product/Service]. I need TAM, SAM, and SOM calculations with supporting data and methodology.',
    tasks: [
      { id: 1, title: 'Define Target Market', description: 'Clearly scope the market boundaries and segments' },
      { id: 2, title: 'Gather Market Data', description: 'Collect industry reports, census data, and market research' },
      { id: 3, title: 'Calculate TAM (Top-Down)', description: 'Total addressable market using industry data' },
      { id: 4, title: 'Calculate TAM (Bottom-Up)', description: 'Validate with bottom-up customer counting' },
      { id: 5, title: 'Define SAM', description: 'Serviceable addressable market within reach' },
      { id: 6, title: 'Estimate SOM', description: 'Serviceable obtainable market (realistic capture)' },
      { id: 7, title: 'Identify Key Assumptions', description: 'Document all assumptions used in calculations' },
      { id: 8, title: 'Analyze Market Growth', description: 'Historical growth rates and future projections' },
      { id: 9, title: 'Segment Analysis', description: 'Break down market by key segments' },
      { id: 10, title: 'Validate with Comparables', description: 'Check against similar markets/companies' },
      { id: 11, title: 'Create Visualization', description: 'Charts and graphs for presentation' },
      { id: 12, title: 'Sensitivity Analysis', description: 'Test assumptions with different scenarios' },
      { id: 13, title: 'Draft Final Report', description: 'Compile findings into executive summary' },
    ]
  },
  
  // Strategy & Planning
  {
    id: 'operating-model',
    title: 'Operating Model Redesign Blueprint',
    description: 'Redesign organizational structure for efficiency and growth',
    icon: '🏗️',
    taskCount: 9,
    category: 'operations',
    tags: ['Org Design', 'Efficiency', 'Transformation'],
    prompt: 'I need to redesign our operating model for [Company]. Current structure is [describe]. Goals: improve efficiency, reduce costs, enable growth.',
    tasks: [
      { id: 1, title: 'Assess Current Operating Model' },
      { id: 2, title: 'Identify Pain Points & Inefficiencies' },
      { id: 3, title: 'Benchmark Against Best Practices' },
      { id: 4, title: 'Design Target Operating Model' },
      { id: 5, title: 'Define Roles & Responsibilities' },
      { id: 6, title: 'Create Transition Plan' },
      { id: 7, title: 'Estimate Cost Savings' },
      { id: 8, title: 'Develop Change Management Strategy' },
      { id: 9, title: 'Draft Implementation Roadmap' },
    ]
  },
  {
    id: 'procurement-savings',
    title: 'Procurement Savings Wave Plan',
    description: 'Identify and prioritize cost savings opportunities across procurement',
    icon: '💰',
    taskCount: 9,
    category: 'operations',
    tags: ['Cost Reduction', 'Procurement', 'Savings'],
    prompt: 'Analyze our procurement spend and build a savings wave plan. Current spend: [amount]. Key categories: [list]. Target: [X]% savings.',
    tasks: [
      { id: 1, title: 'Analyze Spend Data by Category' },
      { id: 2, title: 'Identify Savings Opportunities' },
      { id: 3, title: 'Prioritize by Impact & Ease' },
      { id: 4, title: 'Build Wave 1 (Quick Wins)' },
      { id: 5, title: 'Build Wave 2 (Medium-term)' },
      { id: 6, title: 'Build Wave 3 (Strategic)' },
      { id: 7, title: 'Estimate Savings per Wave' },
      { id: 8, title: 'Create Implementation Timeline' },
      { id: 9, title: 'Draft Governance Model' },
    ]
  },
  {
    id: 'zero-based-budgeting',
    title: 'Zero-Based Budgeting Starter Kit',
    description: 'Build budgets from scratch to eliminate wasteful spending',
    icon: '📉',
    taskCount: 17,
    category: 'operations',
    tags: ['Budgeting', 'Cost Control', 'Finance'],
    prompt: 'Help me implement zero-based budgeting for [Department/Company]. Current budget: [amount]. I need to justify every expense from scratch.',
    tasks: [
      { id: 1, title: 'Define Budgeting Scope & Timeline' },
      { id: 2, title: 'Identify Budget Owners' },
      { id: 3, title: 'Break Down Cost Categories' },
      { id: 4, title: 'Document Current Spending' },
      { id: 5, title: 'Define Decision Units' },
      { id: 6, title: 'Create Justification Templates' },
      { id: 7, title: 'Set Review Criteria' },
      { id: 8, title: 'Gather Budget Requests' },
      { id: 9, title: 'Review & Challenge Requests' },
      { id: 10, title: 'Prioritize by Business Value' },
      { id: 11, title: 'Identify Quick Cost Reductions' },
      { id: 12, title: 'Build Zero-Based Budget' },
      { id: 13, title: 'Compare vs Traditional Budget' },
      { id: 14, title: 'Estimate Total Savings' },
      { id: 15, title: 'Create Implementation Plan' },
      { id: 16, title: 'Draft Communication Strategy' },
      { id: 17, title: 'Build Ongoing Governance Process' },
    ]
  },
  
  // Pricing & Revenue
  {
    id: 'pricing-diagnostic',
    title: 'Willingness-to-Pay & Pricing Diagnostic',
    description: 'Understand customer value perception and optimize pricing strategy',
    icon: '💵',
    taskCount: 6,
    category: 'pricing',
    tags: ['Pricing', 'Customer Research', 'Revenue'],
    prompt: 'Conduct a pricing diagnostic for [Product/Service]. Current price: [amount]. I need to understand willingness-to-pay and optimize pricing.',
    tasks: [
      { id: 1, title: 'Analyze Current Pricing Model' },
      { id: 2, title: 'Conduct Customer Research' },
      { id: 3, title: 'Determine Willingness-to-Pay' },
      { id: 4, title: 'Benchmark Competitor Pricing' },
      { id: 5, title: 'Model Price Elasticity' },
      { id: 6, title: 'Recommend Pricing Changes' },
    ]
  },
  {
    id: 'net-revenue-management',
    title: 'Net Revenue Management Playbook',
    description: 'Maximize revenue through pricing, promotions, and channel optimization',
    icon: '📈',
    taskCount: 14,
    category: 'pricing',
    tags: ['Revenue Growth', 'Pricing', 'Promotions'],
    prompt: 'Build a net revenue management strategy for [Company]. Focus on pricing architecture, promotional effectiveness, and channel optimization.',
    tasks: [
      { id: 1, title: 'Analyze Revenue Leakage' },
      { id: 2, title: 'Audit Discount Practices' },
      { id: 3, title: 'Review Promotional Effectiveness' },
      { id: 4, title: 'Assess Channel Mix' },
      { id: 5, title: 'Design Pricing Architecture' },
      { id: 6, title: 'Create Discount Guardrails' },
      { id: 7, title: 'Optimize Promotional Strategy' },
      { id: 8, title: 'Build Channel Strategy' },
      { id: 9, title: 'Model Revenue Impact' },
      { id: 10, title: 'Create Approval Workflows' },
      { id: 11, title: 'Design Performance Dashboards' },
      { id: 12, title: 'Draft Policy Documents' },
      { id: 13, title: 'Create Training Materials' },
      { id: 14, title: 'Build Implementation Roadmap' },
    ]
  },
  {
    id: 'pricing-architecture',
    title: 'Pricing Architecture & Discount Guardrails',
    description: 'Design pricing tiers and establish discount governance',
    icon: '🎯',
    taskCount: 7,
    category: 'pricing',
    tags: ['Pricing', 'Governance', 'Sales'],
    prompt: 'Design a pricing architecture for [Product/Service]. Include tiering strategy, discount guidelines, and approval workflows.',
    tasks: [
      { id: 1, title: 'Segment Customer Base' },
      { id: 2, title: 'Design Pricing Tiers' },
      { id: 3, title: 'Define Feature Packaging' },
      { id: 4, title: 'Set Discount Guidelines' },
      { id: 5, title: 'Create Approval Matrix' },
      { id: 6, title: 'Build Quote-to-Cash Process' },
      { id: 7, title: 'Draft Pricing Playbook' },
    ]
  },
  
  // Analytics & Insights
  {
    id: 'unit-economics',
    title: 'Unit Economics Case (SaaS/Marketplace)',
    description: 'Model and optimize key unit economics metrics for growth',
    icon: '🔢',
    taskCount: 4,
    category: 'analytics',
    tags: ['SaaS', 'Unit Economics', 'Metrics'],
    prompt: 'Analyze unit economics for [Company]. Key metrics: CAC, LTV, payback period, gross margin. Current data: [provide numbers].',
    tasks: [
      { id: 1, title: 'Calculate CAC by Channel' },
      { id: 2, title: 'Model Customer LTV' },
      { id: 3, title: 'Analyze Payback Period' },
      { id: 4, title: 'Recommend Optimization Strategies' },
    ]
  },
  {
    id: 'churn-cohort',
    title: 'Churn & Cohort Analytics Readout (SaaS)',
    description: 'Analyze customer retention patterns and identify churn drivers',
    icon: '📉',
    taskCount: 11,
    category: 'analytics',
    tags: ['Retention', 'Churn', 'SaaS'],
    prompt: 'Analyze churn and cohort metrics for [Company]. Current churn rate: [X]%. I need to identify drivers and retention strategies.',
    tasks: [
      { id: 1, title: 'Calculate Churn Rate' },
      { id: 2, title: 'Build Cohort Analysis' },
      { id: 3, title: 'Identify Churn Patterns' },
      { id: 4, title: 'Segment High-Risk Customers' },
      { id: 5, title: 'Analyze Usage Metrics' },
      { id: 6, title: 'Survey Churned Customers' },
      { id: 7, title: 'Identify Early Warning Signs' },
      { id: 8, title: 'Design Retention Strategies' },
      { id: 9, title: 'Model Impact of Interventions' },
      { id: 10, title: 'Create Playbook for CSMs' },
      { id: 11, title: 'Build Retention Dashboard' },
    ]
  },
  {
    id: 'store-footprint',
    title: 'Store Footprint Optimization Model (Retail)',
    description: 'Optimize retail locations based on demographics and performance',
    icon: '🏪',
    taskCount: 20,
    category: 'analytics',
    tags: ['Retail', 'Real Estate', 'Analytics'],
    prompt: 'Optimize our retail store footprint. Current stores: [number]. Performance data: [provide]. Goals: maximize ROI, reduce underperforming locations.',
    tasks: [
      { id: 1, title: 'Collect Store Performance Data' },
      { id: 2, title: 'Analyze Sales by Location' },
      { id: 3, title: 'Review Cost Structure' },
      { id: 4, title: 'Gather Demographic Data' },
      { id: 5, title: 'Map Competitor Locations' },
      { id: 6, title: 'Analyze Trade Areas' },
      { id: 7, title: 'Calculate Store ROI' },
      { id: 8, title: 'Identify Underperformers' },
      { id: 9, title: 'Find Cannibalization Issues' },
      { id: 10, title: 'Model Closure Impact' },
      { id: 11, title: 'Identify Expansion Opportunities' },
      { id: 12, title: 'Score Potential Sites' },
      { id: 13, title: 'Build Optimization Model' },
      { id: 14, title: 'Run Scenarios' },
      { id: 15, title: 'Estimate Financial Impact' },
      { id: 16, title: 'Create Action Plan' },
      { id: 17, title: 'Draft Closure Playbook' },
      { id: 18, title: 'Plan Expansion Roadmap' },
      { id: 19, title: 'Build Monitoring Dashboard' },
      { id: 20, title: 'Present Recommendations' },
    ]
  },
  {
    id: 'voc-sprint',
    title: 'Voice-of-Customer Sprint (VoC)',
    description: 'Gather and synthesize customer feedback into actionable insights',
    icon: '🎤',
    taskCount: 5,
    category: 'strategy',
    tags: ['Customer Research', 'Insights', 'Product'],
    prompt: 'Run a voice-of-customer analysis for [Product/Service]. Synthesize feedback, identify themes, and provide actionable recommendations.',
    tasks: [
      { id: 1, title: 'Design Research Plan' },
      { id: 2, title: 'Conduct Customer Interviews' },
      { id: 3, title: 'Synthesize Feedback Themes' },
      { id: 4, title: 'Prioritize by Impact' },
      { id: 5, title: 'Create Action Plan' },
    ]
  },
  
  // Deliverables & Communications
  {
    id: 'board-deck',
    title: 'Board-Ready IC Deck Builder',
    description: 'Generate investment committee presentations with clear recommendations',
    icon: '📑',
    taskCount: 4,
    category: 'diligence',
    tags: ['Presentations', 'Investment', 'Board'],
    prompt: 'Create an investment committee deck for [Opportunity]. Include situation, recommendation, financial analysis, risks, and next steps.',
    tasks: [
      { id: 1, title: 'Draft Executive Summary' },
      { id: 2, title: 'Build Financial Model' },
      { id: 3, title: 'Document Risk Factors' },
      { id: 4, title: 'Create Presentation Deck' },
    ]
  },
  {
    id: 'steerco-update',
    title: 'Weekly SteerCo / Board Update Pack',
    description: 'Automated status reporting with KPIs and executive summaries',
    icon: '📋',
    taskCount: 6,
    category: 'operations',
    tags: ['Reporting', 'KPIs', 'Governance'],
    prompt: 'Generate a weekly steering committee update. Key metrics: [list]. Progress updates: [describe]. Risks and issues: [list].',
    tasks: [
      { id: 1, title: 'Gather KPI Data' },
      { id: 2, title: 'Summarize Progress vs Plan' },
      { id: 3, title: 'Highlight Key Achievements' },
      { id: 4, title: 'Document Risks & Issues' },
      { id: 5, title: 'List Next Steps & Asks' },
      { id: 6, title: 'Format Presentation' },
    ]
  },
  {
    id: 'margin-bridge',
    title: 'Margin Bridge Deep Dive',
    description: 'Analyze margin changes and build waterfall visualizations',
    icon: '🌊',
    taskCount: 6,
    category: 'analytics',
    tags: ['Finance', 'Margin Analysis', 'Visualization'],
    prompt: 'Build a margin bridge analysis. Previous period margin: [X]%. Current: [Y]%. Break down the drivers of change with waterfall chart.',
    tasks: [
      { id: 1, title: 'Collect P&L Data' },
      { id: 2, title: 'Calculate Margin Changes' },
      { id: 3, title: 'Identify Key Drivers' },
      { id: 4, title: 'Build Waterfall Chart' },
      { id: 5, title: 'Document Root Causes' },
      { id: 6, title: 'Recommend Actions' },
    ]
  },
  
  // Real-Time Intelligence (Crustdata-powered)
  {
    id: 'realtime-deal-sourcing',
    title: 'Real-Time Deal Sourcing',
    description: 'Find investment opportunities using live Crustdata signals',
    icon: '🎯',
    taskCount: 6,
    category: 'diligence',
    tags: ['Crustdata', 'Real-time', 'Deal Sourcing', 'Investment'],
    prompt: 'Find tech companies with 50+ employees, 20%+ quarterly growth, and recent funding in the USA. Focus on SaaS and fintech sectors.',
    tasks: [
      { id: 1, title: 'Screen high-growth companies', description: 'Use Crustdata screener to find companies with strong growth metrics' },
      { id: 2, title: 'Analyze funding patterns', description: 'Review recent funding rounds and investor activity' },
      { id: 3, title: 'Assess market signals', description: 'Check hiring trends, web traffic, and market indicators' },
      { id: 4, title: 'Evaluate competitive landscape', description: 'Map competitors and market positioning' },
      { id: 5, title: 'Create investment thesis', description: 'Develop rationale for potential investments' },
      { id: 6, title: 'Build deal pipeline', description: 'Create prioritized list of investment opportunities' }
    ]
  },
  {
    id: 'competitive-intelligence',
    title: 'Competitive Intelligence Monitor',
    description: 'Track competitors and market movements in real-time',
    icon: '📊',
    taskCount: 5,
    category: 'strategy',
    tags: ['Crustdata', 'Competitive', 'Market Intelligence', 'Real-time'],
    prompt: 'Monitor our top 5 competitors for hiring changes, product launches, and market signals. Focus on [Industry] sector.',
    tasks: [
      { id: 1, title: 'Set up company monitoring', description: 'Configure watches for key competitors' },
      { id: 2, title: 'Track executive movements', description: 'Monitor leadership changes and new hires' },
      { id: 3, title: 'Analyze market expansion', description: 'Identify geographic and product expansion' },
      { id: 4, title: 'Monitor customer signals', description: 'Track customer acquisition and retention indicators' },
      { id: 5, title: 'Generate intelligence reports', description: 'Create weekly competitive intelligence summaries' }
    ]
  },
  {
    id: 'talent-scouting',
    title: 'AI Talent Scouting',
    description: 'Find and analyze key talent using real-time people data',
    icon: '👥',
    taskCount: 4,
    category: 'operations',
    tags: ['Crustdata', 'Talent', 'Recruiting', 'People'],
    prompt: 'Find senior engineers and product managers at top tech companies in the Bay Area. Focus on AI/ML expertise.',
    tasks: [
      { id: 1, title: 'Search for key talent', description: 'Use people search to find candidates by role and company' },
      { id: 2, title: 'Analyze career trajectories', description: 'Review career progression and experience' },
      { id: 3, title: 'Assess skills and expertise', description: 'Evaluate technical skills and domain knowledge' },
      { id: 4, title: 'Create talent pipeline', description: 'Build prioritized list of potential candidates' }
    ]
  },
  {
    id: 'market-signal-monitoring',
    title: 'Market Signal Monitoring',
    description: 'Real-time alerts on key market events and company changes',
    icon: '🚨',
    taskCount: 5,
    category: 'strategy',
    tags: ['Crustdata', 'Signals', 'Monitoring', 'Alerts'],
    prompt: 'Set up monitoring for funding announcements, executive changes, and hiring spikes in the fintech sector.',
    tasks: [
      { id: 1, title: 'Configure signal tracking', description: 'Set up alerts for key market events' },
      { id: 2, title: 'Monitor funding rounds', description: 'Track new funding announcements' },
      { id: 3, title: 'Watch executive movements', description: 'Monitor C-level changes and promotions' },
      { id: 4, title: 'Analyze hiring trends', description: 'Identify companies with rapid hiring' },
      { id: 5, title: 'Generate alert summaries', description: 'Create daily/weekly signal reports' }
    ]
  },
  {
    id: 'company-deep-dive',
    title: 'Company Deep Dive Analysis',
    description: 'Comprehensive company research using real-time data',
    icon: '🔬',
    taskCount: 7,
    category: 'diligence',
    tags: ['Crustdata', 'Research', 'Analysis', 'Due Diligence'],
    prompt: 'Conduct a deep dive analysis on [Company Name]. Include financials, team, growth metrics, and market position.',
    tasks: [
      { id: 1, title: 'Enrich company data', description: 'Get comprehensive company information' },
      { id: 2, title: 'Analyze team composition', description: 'Review leadership and key employees' },
      { id: 3, title: 'Assess growth metrics', description: 'Evaluate headcount, funding, and market signals' },
      { id: 4, title: 'Review social presence', description: 'Analyze LinkedIn posts and engagement' },
      { id: 5, title: 'Map competitive position', description: 'Compare against similar companies' },
      { id: 6, title: 'Identify risks and opportunities', description: 'Document key findings' },
      { id: 7, title: 'Create investment memo', description: 'Compile comprehensive analysis report' }
    ]
  },
];

// Group WorkStreams by category
export const WORKSTREAM_CATEGORIES = {
  diligence: {
    title: 'Due Diligence & Research',
    description: 'Fast-track M&A analysis and market research',
    icon: '🔍'
  },
  strategy: {
    title: 'Strategy & Market Intelligence',
    description: 'Market sizing, competitive analysis, and strategic planning',
    icon: '🎯'
  },
  operations: {
    title: 'Operations & Transformation',
    description: 'Operating model design and cost optimization',
    icon: '⚙️'
  },
  pricing: {
    title: 'Pricing & Revenue Growth',
    description: 'Pricing strategy and revenue optimization',
    icon: '💵'
  },
  analytics: {
    title: 'Analytics & Insights',
    description: 'Data-driven analysis and performance metrics',
    icon: '📊'
  }
};

// Quick starters for users who want to explore
export const QUICK_STARTERS = [
  "Find fast-growing SaaS companies in the USA with 50+ employees",
  "Analyze competitive landscape for AI-powered customer service tools",
  "Find senior engineers at Google and Microsoft with AI/ML skills",
  "Monitor recent funding rounds in the fintech sector",
  "Get detailed information about Stripe's growth and team",
  "Create a cost reduction roadmap for procurement",
  "Build a competitive battlecard for our SaaS product",
  "Generate a board deck for this acquisition opportunity"
];

