import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';
import { CrustDataService } from '@/lib/crustdata';
import { crustdataTools } from '@/lib/crustdata-tools';
import { WORKSTREAMS } from '@/lib/workstreams';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const prisma = new PrismaClient();

// Initialize Crustdata service
const crustdataService = process.env.CRUSTDATA_API_KEY 
  ? new CrustDataService(process.env.CRUSTDATA_API_KEY)
  : null;

// Helper function to execute Crustdata tool calls
async function executeCrustdataTools(toolCalls: any[]) {
  if (!crustdataService) {
    return toolCalls.map(call => ({
      tool_call_id: call.id,
      role: 'tool' as const,
      content: JSON.stringify({ error: 'Crustdata API key not configured' })
    }));
  }

  const results = [];

  for (const toolCall of toolCalls) {
    const { name, arguments: args } = toolCall.function;
    let parsedArgs;
    
    try {
      parsedArgs = JSON.parse(args);
    } catch (error) {
      results.push({
        tool_call_id: toolCall.id,
        role: 'tool' as const,
        content: JSON.stringify({ error: 'Invalid arguments format' })
      });
      continue;
    }

    try {
      let data;
      
      switch (name) {
        case 'screen_companies':
          console.log('🔍 Screening companies with params:', JSON.stringify(parsedArgs, null, 2));
          data = await crustdataService.screenCompanies({
            headcount: parsedArgs.minHeadcount || parsedArgs.maxHeadcount ? {
              min: parsedArgs.minHeadcount,
              max: parsedArgs.maxHeadcount
            } : undefined,
            headcountGrowth: parsedArgs.minGrowthRate ? { min: parsedArgs.minGrowthRate } : undefined,
            funding: parsedArgs.minFunding ? { min: parsedArgs.minFunding } : undefined,
            location: parsedArgs.location,
            foundedAfter: parsedArgs.foundedAfter
          });
          console.log('✅ Crustdata returned:', typeof data, 'with', data?.rows?.length || 0, 'companies');
          break;

        case 'enrich_companies':
          data = await crustdataService.enrichCompanies({
            companyNames: parsedArgs.companyNames,
            domains: parsedArgs.domains,
            linkedinUrls: parsedArgs.linkedinUrls,
            fields: parsedArgs.fields
          });
          break;

        case 'search_people':
          data = await crustdataService.searchPeople({
            currentCompany: parsedArgs.currentCompany,
            title: parsedArgs.title,
            location: parsedArgs.location,
            skills: parsedArgs.skills,
            limit: parsedArgs.limit
          });
          break;

        case 'enrich_people':
          data = await crustdataService.enrichPeople({
            linkedinUrls: parsedArgs.linkedinUrls,
            emails: parsedArgs.emails
          });
          break;

        case 'get_linkedin_posts':
          data = await crustdataService.getLinkedInPosts({
            personLinkedinUrl: parsedArgs.personLinkedinUrl,
            companyName: parsedArgs.companyName,
            companyDomain: parsedArgs.companyDomain,
            limit: parsedArgs.limit
          });
          break;

        case 'get_company_people':
          data = await crustdataService.getCompanyPeople({
            companyName: parsedArgs.companyName,
            companyLinkedinId: parsedArgs.companyLinkedinId,
            companyId: parsedArgs.companyId,
            s3Username: parsedArgs.s3Username || 'consultgpt-user' // Use provided or default
          });
          break;

        default:
          throw new Error(`Unknown tool: ${name}`);
      }

      results.push({
        tool_call_id: toolCall.id,
        role: 'tool' as const,
        content: JSON.stringify(data)
      });

    } catch (error) {
      console.error(`❌ Crustdata tool call error for ${name}:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      results.push({
        tool_call_id: toolCall.id,
        role: 'tool' as const,
        content: JSON.stringify({ 
          error: errorMessage,
          suggestion: 'Try broadening your search criteria or use enrich_companies with known company names instead.'
        })
      });
    }
  }

  return results;
}

// Helper function to generate workflow-specific system prompts
function getWorkflowSystemPrompt(workflowId: string, hasCrustdata: boolean): string {
  const workflow = WORKSTREAMS.find(w => w.id === workflowId);
  
  if (!workflow) {
    console.log('❌ Workflow not found:', workflowId);
    return ''; // Return empty if workflow not found
  }
  
  console.log('🔧 Building system prompt for workflow:', workflowId, 'Component type:', workflow.generatesComponent);

  const crustdataContext = hasCrustdata ? `

REAL-TIME DATA ACCESS:
You have access to real-time company and people data through Crustdata. Use these tools proactively:

BEST PRACTICE WORKFLOW:
1. screen_companies: Filter by COUNTRY (not city), headcount range. Growth filtering may return empty results - screen broadly first.
2. enrich_companies: Get detailed data for screened companies (includes city, growth %, funding)
3. Post-process: Filter enriched results by city and growth % yourself before creating the table

Available Tools:
- screen_companies: Find companies by headcount, funding, COUNTRY (not city-level)
- enrich_companies: Get detailed company information (city, growth, financials)
- search_people: Find professionals by role, company, skills
- enrich_people: Get detailed professional profiles
- get_linkedin_posts: Recent social media activity
- get_company_people: List employees at a company` : '';

  const componentInstructions = workflow.generatesComponent ? `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  CRITICAL: COMPONENT GENERATION REQUIRED ⚠️
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This workflow MUST generate a ${workflow.generatesComponent} component.

═══════════════════════════════════════════════════════
📖 COMPONENT USAGE GUIDE
═══════════════════════════════════════════════════════

⚡ WHEN TO USE EACH COMPONENT:
- TABLE: Lists of companies/people with multiple attributes (MOST COMMON)
- CHART: Comparing numeric values across categories (market sizing, revenue)
- MATRIX: Positioning analysis (competitive landscape, market mapping)
- CARD: Rich profiles (talent pipelines, company deep dives)
- TIMELINE: Chronological events (funding history, company milestones)

═══════════════════════════════════════════════════════
${workflow.generatesComponent === 'table' ? `
🔸 TABLE COMPONENT - Interactive Data Tables

PURPOSE: Display structured data that users can sort and analyze

COLUMN TYPES:
- "text": Regular text (company names, descriptions)
- "number": Integers displayed with commas (e.g., 1,500)
- "percentage": Numbers displayed as % (e.g., 25 → "25%")
- "currency": USD amounts (e.g., 15000000 → "$15.0M")
- "link": Clickable URLs

KEY RULES:
✓ Use descriptive "label" for column headers (what user sees)
✓ Use short "key" for data fields (what code uses)
✓ Keys must match exactly between columns and row data
✓ Currency values: Always use raw numbers (15000000, not "$15M")
✓ Percentage values: Use raw numbers (25, not "25%")
✓ Set "sortable": true to enable column sorting
✓ Include 5-15 rows for optimal display

EXAMPLE:
{
  "type": "table",
  "title": "Top Growth Companies",
  "description": "Q4 2024 data from Crustdata",
  "columns": [
    {"key": "company", "label": "Company Name", "type": "text"},
    {"key": "employees", "label": "Team Size", "type": "number"},
    {"key": "growth", "label": "YoY Growth", "type": "percentage"},
    {"key": "funding", "label": "Total Raised", "type": "currency"}
  ],
  "rows": [
    {"company": "Acme AI", "employees": 87, "growth": 42, "funding": 15000000},
    {"company": "DataCorp", "employees": 156, "growth": 28, "funding": 25000000}
  ],
  "sortable": true
}
` : ''}${workflow.generatesComponent === 'chart' ? `
🔸 CHART COMPONENT - Horizontal Bar Charts

PURPOSE: Compare values across categories with visual bars

HOW IT WORKS:
- Displays horizontal bars proportional to values
- Automatically scales bars to fit (largest = 100% width)
- Shows value labels and percentages
- Best for: Market sizing, revenue comparison, headcount comparison

KEY RULES:
✓ Each data point needs "label" (category name) and "value" (numeric)
✓ Values should be comparable numbers (all revenue, all headcount, etc.)
✓ Use 3-10 data points for optimal readability
✓ Values displayed with thousand separators (e.g., 15,000,000)
✓ Bars show relative size (largest always 100% wide)
✓ Optional: "xAxisLabel" and "yAxisLabel" for context

DATA REQUIREMENTS:
- "label": Text label for the category
- "value": Raw number (will be formatted automatically)
- "color": Optional hex color (currently uses zinc-900 for all)

EXAMPLE - Market Size Analysis:
{
  "type": "chart",
  "title": "SaaS Market Size by Segment",
  "description": "Total Addressable Market 2024",
  "chartType": "bar",
  "data": [
    {"label": "Enterprise CRM", "value": 85000000},
    {"label": "Marketing Automation", "value": 62000000},
    {"label": "Sales Tools", "value": 45000000},
    {"label": "Customer Support", "value": 38000000}
  ],
  "xAxisLabel": "Market Segment",
  "yAxisLabel": "Market Size (USD)"
}

OUTPUT: Shows bars where Enterprise CRM (largest) is 100% wide,
Sales Tools is ~53% wide (45M/85M), etc.
` : ''}${workflow.generatesComponent === 'matrix' ? `
🔸 MATRIX COMPONENT - 2x2 Positioning Matrix

PURPOSE: Show competitive positioning across two dimensions

STRUCTURE:
- xAxis: Horizontal dimension (e.g., Price, Market Share)
- yAxis: Vertical dimension (e.g., Quality, Innovation)
- 4 quadrants: topLeft, topRight, bottomLeft, bottomRight

KEY RULES:
✓ Each axis needs "label", "min", and "max" descriptions
✓ Position items using x/y coordinates (0-100 scale)
✓ Each quadrant has a "label" and array of "items"
✓ Items need "name", "x" position, "y" position
✓ Distribute items across all 4 quadrants for balance
✓ Use for competitive analysis, market positioning

EXAMPLE:
{
  "type": "matrix",
  "title": "Competitive Landscape - AI SaaS",
  "description": "Price vs. Feature Completeness",
  "xAxis": {"label": "Price", "min": "Low", "max": "High"},
  "yAxis": {"label": "Features", "min": "Basic", "max": "Advanced"},
  "quadrants": {
    "topLeft": {
      "label": "Premium Value",
      "items": [{"name": "Acme AI", "x": 20, "y": 80}]
    },
    "topRight": {
      "label": "Market Leaders",
      "items": [{"name": "DataCorp", "x": 75, "y": 85}]
    },
    "bottomLeft": {
      "label": "Budget Options",
      "items": [{"name": "StartupTech", "x": 15, "y": 25}]
    },
    "bottomRight": {
      "label": "Overpriced",
      "items": [{"name": "LegacyCo", "x": 85, "y": 30}]
    }
  }
}
` : ''}${workflow.generatesComponent === 'card' ? `
🔸 CARD COMPONENT - Profile Cards

PURPOSE: Display rich profiles with metrics and tags

STRUCTURE:
- Each card is a self-contained profile
- Includes title, subtitle, metrics, tags, description
- Layout can be "grid" or "list"

KEY RULES:
✓ Each card needs unique "id"
✓ "title": Main heading (e.g., company name)
✓ "subtitle": Secondary info (e.g., industry)
✓ "metrics": Array of key stats with labels and values
✓ "trend": Use "up", "down", or "neutral" for metric arrows
✓ "tags": Array of category labels
✓ Use 3-10 cards for optimal display
✓ Keep descriptions concise (1-2 sentences)

EXAMPLE:
{
  "type": "card",
  "title": "Top Talent Profiles",
  "description": "Senior engineers at FAANG companies",
  "layout": "grid",
  "cards": [
    {
      "id": "1",
      "title": "Sarah Chen",
      "subtitle": "Senior ML Engineer at Google",
      "metrics": [
        {"label": "Experience", "value": "8 years", "trend": "up"},
        {"label": "Team Size", "value": "12", "trend": "neutral"}
      ],
      "tags": ["Python", "TensorFlow", "AI/ML"],
      "description": "Led ML platform scaling to 1M+ users"
    }
  ]
}
` : ''}${workflow.generatesComponent === 'timeline' ? `
🔸 TIMELINE COMPONENT - Event Timeline

PURPOSE: Show chronological events and milestones

EVENT TYPES:
- "funding": Funding rounds
- "milestone": Company milestones
- "launch": Product launches
- "acquisition": M&A events
- "other": General events

KEY RULES:
✓ "date": Use YYYY-MM-DD format
✓ "title": Brief event name
✓ "description": 1-2 sentence explanation
✓ "type": Choose from event types above
✓ "amount": Optional, for funding events (e.g., "$10M")
✓ "sortOrder": Use "desc" for newest first, "asc" for oldest first
✓ Include 5-20 events for context

EXAMPLE:
{
  "type": "timeline",
  "title": "Acme AI Growth Journey",
  "description": "Key milestones and funding",
  "sortOrder": "desc",
  "events": [
    {
      "date": "2024-03-15",
      "title": "Series B Funding",
      "description": "Raised $25M led by Sequoia",
      "type": "funding",
      "amount": "$25M"
    },
    {
      "date": "2023-09-20",
      "title": "Launched AI Platform",
      "description": "Public launch with 100+ beta customers",
      "type": "launch"
    }
  ]
}
` : ''}

═══════════════════════════════════════════════════════
📋 FINAL OUTPUT FORMAT
═══════════════════════════════════════════════════════

YOUR FINAL RESPONSE MUST BE THIS EXACT JSON STRUCTURE:

{
  "text": "Your detailed analysis here. Include insights, patterns, recommendations. This appears as text above the visualization.",
  "component": {
    "type": "${workflow.generatesComponent}",
    "title": "Clear, descriptive title",
    "description": "1-sentence context",
    ... component-specific fields as shown above ...
  }
}

CRITICAL REQUIREMENTS:
✅ Return ONLY the JSON object (start with { end with })
✅ NO markdown code blocks (\`\`\`json)
✅ NO explanations before/after the JSON
✅ Use REAL data from Crustdata tool calls
✅ Format numbers correctly (raw values, not formatted strings)
✅ All keys must match exactly between columns and rows
✅ Validate your JSON structure before returning

REMEMBER: The frontend automatically formats currency/percentage/numbers.
Send raw values: 15000000 (not "$15M"), 42 (not "42%"), 1500 (not "1,500")

═══════════════════════════════════════════════════════
❌ COMMON MISTAKES TO AVOID
═══════════════════════════════════════════════════════

1. ❌ WRONG: Formatted numbers in data
   {"funding": "$15M", "growth": "42%", "employees": "1,500"}
   ✅ RIGHT: Raw numbers
   {"funding": 15000000, "growth": 42, "employees": 1500}

2. ❌ WRONG: Mismatched column keys and row data
   columns: [{"key": "company_name", ...}]
   rows: [{"companyName": "Acme"}]  // Different key!
   ✅ RIGHT: Exact match
   columns: [{"key": "company", ...}]
   rows: [{"company": "Acme"}]

3. ❌ WRONG: Including error messages in JSON response
   {"error": "..."} { "text": "...", "component": {...} }
   ✅ RIGHT: Clean JSON only
   { "text": "...", "component": {...} }

4. ❌ WRONG: Empty or placeholder data
   rows: [{"company": "TBD", "employees": 0}]
   ✅ RIGHT: Real data from Crustdata
   rows: [{"company": "Acme AI", "employees": 87}]

5. ❌ WRONG: Missing required fields
   {"type": "table", "columns": [...]}  // Missing rows!
   ✅ RIGHT: Complete structure
   {"type": "table", "title": "...", "columns": [...], "rows": [...]}

6. ❌ WRONG: Using text responses instead of components
   "Here is a table of companies: Acme (87 employees), DataCorp (156 employees)"
   ✅ RIGHT: Actual table component
   { "text": "Analysis...", "component": {"type": "table", ...} }` : '';

  // Workflow-specific prompts based on category
  const categoryPrompts: Record<string, string> = {
    'intelligence': `You are an expert management consultant specializing in real-time market intelligence and company research. You help consulting firms gather and analyze live data for strategic decisions.${crustdataContext}

CURRENT WORKFLOW: ${workflow.title}
${workflow.description}

Your goal is to help the user complete this workflow efficiently. Focus on:
${workflow.tasks.map((t, i) => `${i + 1}. ${t.title}${t.description ? ': ' + t.description : ''}`).join('\n')}
${componentInstructions}

Provide structured, actionable insights with real-time data that consulting firms can use in client deliverables.`,
    
    'analysis': `You are an expert strategy consultant specializing in competitive analysis and market intelligence. You help consulting firms develop strategic recommendations with data-driven insights.${crustdataContext}

CURRENT WORKFLOW: ${workflow.title}
${workflow.description}

Your goal is to help the user complete this workflow efficiently. Focus on:
${workflow.tasks.map((t, i) => `${i + 1}. ${t.title}${t.description ? ': ' + t.description : ''}`).join('\n')}
${componentInstructions}

Provide strategic insights with clear frameworks and actionable recommendations.`,
    
    'visualization': `You are an expert data visualization consultant. You help consulting firms create compelling visual reports and interactive dashboards.${crustdataContext}

CURRENT WORKFLOW: ${workflow.title}
${workflow.description}

Your goal is to help the user complete this workflow efficiently. Focus on:
${workflow.tasks.map((t, i) => `${i + 1}. ${t.title}${t.description ? ': ' + t.description : ''}`).join('\n')}
${componentInstructions}

Provide data-driven insights with clear visualizations and actionable recommendations.`,
    
  };

  return categoryPrompts[workflow.category] || '';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      message, 
      messages, 
      chatId,
      conversationContext = 'general_chat',
      workflowId
    } = body;

    // Handle single message or conversation
    let conversationMessages;
    if (messages) {
      conversationMessages = messages;
    } else if (message) {
      conversationMessages = [{ role: 'user', content: message }];
    } else {
      return NextResponse.json(
        { error: 'Either "message" or "messages" is required' },
        { status: 400 }
      );
    }

    // Create system prompt - prioritize workflow-specific prompts
    let systemPrompt = '';
    
    // First, check if there's a workflow-specific prompt
    if (workflowId) {
      const workflowPrompt = getWorkflowSystemPrompt(workflowId, !!crustdataService);
      if (workflowPrompt) {
        systemPrompt = workflowPrompt;
      }
    }
    
    // If no workflow prompt, use default consulting prompt
    if (!systemPrompt) {
      systemPrompt = `You are an expert AI consulting assistant specializing in strategy, operations, market analysis, and business intelligence. You help consulting firms deliver high-quality insights and recommendations to their clients.

${crustdataService ? `
You have access to real-time company and people data through Crustdata. Use the available tools to provide up-to-date information when users ask about companies, markets, people, or competitive intelligence.
` : ''}`;
    }

    console.log('Sending to ChatGPT:', {
      workflowId: workflowId || 'none',
      usingWorkflowPrompt: !!workflowId,
      messagesCount: conversationMessages.length,
      crustdataEnabled: !!crustdataService,
      systemPromptLength: systemPrompt.length
    });

    // First call to ChatGPT with Crustdata tools
    let response;
    try {
      response = await openai.chat.completions.create({
      model: 'gpt-5',
      messages: [
        { role: 'system', content: systemPrompt },
        ...conversationMessages
      ],
      tools: crustdataService ? crustdataTools : undefined,
      tool_choice: crustdataService ? 'auto' : undefined,
      max_completion_tokens: 1500,
      });
    } catch (apiError: any) {
      console.error('❌ OpenAI API Error (first call):', {
        message: apiError.message,
        type: apiError.type,
        code: apiError.code,
        status: apiError.status
      });
      return NextResponse.json(
        { 
          error: 'AI service error', 
          details: apiError.message,
          message: 'I encountered an error while processing your request. Please try again or rephrase your question.'
        },
        { status: 500 }
      );
    }

    if (!response.choices || response.choices.length === 0) {
      console.error('❌ No choices returned from OpenAI');
      return NextResponse.json(
        { error: 'No response from AI service' },
        { status: 500 }
      );
    }

    const responseMessage = response.choices[0].message;
    let responseText = responseMessage.content || '';
    let toolCallsInfo: any[] = [];

    // If no content and no tool calls, something went wrong
    if (!responseText && (!responseMessage.tool_calls || responseMessage.tool_calls.length === 0)) {
      console.error('❌ Empty response from GPT-5:', {
        finishReason: response.choices[0].finish_reason,
        hasToolCalls: !!responseMessage.tool_calls,
        fullResponse: JSON.stringify(response, null, 2).substring(0, 500)
      });
      return NextResponse.json(
        { 
          error: 'Empty response from AI',
          message: 'The AI did not generate a response. This might be due to content filters or prompt length. Please try a simpler query.'
        },
        { status: 500 }
      );
    }

    // Check if ChatGPT wants to call Crustdata tools
    if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
      console.log('ChatGPT requested tool calls:', responseMessage.tool_calls.map((tc: any) => tc.function.name));
      
      // Execute Crustdata tool calls
      const toolResults = await executeCrustdataTools(responseMessage.tool_calls);
      
      // Store tool call info for response metadata
      toolCallsInfo = responseMessage.tool_calls.map((tc: any) => ({
        name: tc.function.name,
        arguments: tc.function.arguments
      }));
      
      // Add tool results to conversation and get final response
      const finalMessages = [
        { role: 'system' as const, content: systemPrompt },
        ...conversationMessages,
        responseMessage,
        ...toolResults,
        // Explicit reminder to return JSON for workflows that generate components
        ...(workflowId && WORKSTREAMS.find(w => w.id === workflowId)?.generatesComponent ? [{
          role: 'user' as const,
          content: 'Now synthesize the data into the required JSON format with both "text" and "component" fields. CRITICAL: Return ONLY the valid JSON object starting with { and ending with }. Do NOT include any error messages, explanations, or text before/after the JSON. Just the pure JSON object.'
        }] : [])
      ];

      let finalResponse;
      try {
        finalResponse = await openai.chat.completions.create({
        model: 'gpt-5',
        messages: finalMessages,
          max_completion_tokens: 3000, // Increased for complex components
        });
      } catch (apiError: any) {
        console.error('❌ OpenAI API Error (final call):', {
          message: apiError.message,
          type: apiError.type,
          code: apiError.code,
          status: apiError.status
        });
        return NextResponse.json(
          { 
            error: 'AI service error', 
            details: apiError.message,
            message: 'I encountered an error while generating the final response. The data was retrieved successfully, but formatting failed.'
          },
          { status: 500 }
        );
      }

      if (!finalResponse.choices || finalResponse.choices.length === 0) {
        console.error('❌ No choices in final response');
        return NextResponse.json(
          { error: 'No final response from AI service' },
          { status: 500 }
        );
      }

      responseText = finalResponse.choices[0].message.content || '';
      
      // Check if final response is empty
      if (!responseText) {
        console.error('❌ Empty final response from GPT-5:', {
          finishReason: finalResponse.choices[0].finish_reason,
          toolCallsUsed: toolCallsInfo.length,
          fullResponse: JSON.stringify(finalResponse, null, 2).substring(0, 500)
        });
        return NextResponse.json(
          { 
            error: 'Empty final response',
            message: 'The AI could not generate a response after processing the data. Please try again with a simpler request.'
          },
          { status: 500 }
        );
      }
    }

    // Parse component data if present
    let componentData = null;
    let finalResponseText = responseText;
    
    console.log('GPT-5 Response length:', responseText.length);
    console.log('Response preview:', responseText.substring(0, 200));
    
    try {
      // Strategy: Look for JSON object with "text" and "component" fields
      // Handle various formatting (with/without spaces, with/without newlines)
      let parsed = null;
      
      // Try multiple patterns to find the start of the JSON
      const patterns = [
        /\{\s*"text"\s*:/,  // Match { "text": with any whitespace
        /\{\s*'text'\s*:/,  // Match { 'text': with single quotes
      ];
      
      let startIndex = -1;
      for (const pattern of patterns) {
        const match = responseText.match(pattern);
        if (match) {
          startIndex = match.index!;
          break;
        }
      }
      
      if (startIndex !== -1) {
        console.log('📍 Found JSON start at position:', startIndex);
        
        // Extract from this point to the end, then find matching closing brace
        const jsonPart = responseText.substring(startIndex);
        
        // Count braces to find the matching closing brace
        let braceCount = 0;
        let inString = false;
        let escapeNext = false;
        let endIndex = 0;
        
        for (let i = 0; i < jsonPart.length; i++) {
          const char = jsonPart[i];
          
          if (escapeNext) {
            escapeNext = false;
            continue;
          }
          
          if (char === '\\') {
            escapeNext = true;
            continue;
          }
          
          if (char === '"' && !inString) {
            inString = true;
            continue;
          }
          
          if (char === '"' && inString) {
            inString = false;
            continue;
          }
          
          if (!inString) {
            if (char === '{') braceCount++;
            if (char === '}') {
              braceCount--;
              if (braceCount === 0) {
                endIndex = i + 1;
                break;
              }
            }
          }
        }
        
        if (endIndex > 0) {
          const jsonString = jsonPart.substring(0, endIndex);
          console.log('📦 Attempting to parse JSON, length:', jsonString.length);
          console.log('📦 JSON preview:', jsonString.substring(0, 100) + '...');
          
          try {
            parsed = JSON.parse(jsonString);
            if (parsed.text && parsed.component && parsed.component.type) {
          finalResponseText = parsed.text;
          componentData = parsed.component;
              console.log('✅ Component data extracted:', componentData.type);
              console.log('✅ Component details:', {
                type: componentData.type,
                title: componentData.title,
                rows: componentData.rows?.length || 0,
                columns: componentData.columns?.length || 0,
                cards: componentData.cards?.length || 0,
                events: componentData.events?.length || 0
              });
            } else {
              console.log('❌ JSON parsed but missing required fields:', {
                hasText: !!parsed.text,
                hasComponent: !!parsed.component,
                hasType: !!parsed.component?.type
              });
            }
          } catch (e) {
            console.log('❌ JSON parse error:', e instanceof Error ? e.message : e);
            console.log('❌ Failed JSON sample:', jsonString.substring(0, 200));
          }
        } else {
          console.log('❌ Could not find matching closing brace');
        }
      } else {
        console.log('❌ No JSON pattern found in response');
        console.log('Response sample:', responseText.substring(0, 500));
      }
    } catch (error) {
      console.log('❌ JSON extraction error:', error instanceof Error ? error.message : error);
    }

    // Log what we're sending to frontend
    console.log('📤 API Response Summary:', {
      responseLength: finalResponseText.length,
      hasToolCalls: toolCallsInfo.length > 0,
      hasComponent: !!componentData,
      componentType: componentData?.type || 'none',
      componentSummary: componentData ? {
        type: componentData.type,
        title: componentData.title,
        cards: componentData.cards?.length || 0,
        rows: componentData.rows?.length || 0
      } : null
    });

    return NextResponse.json({
      success: true,
      response: finalResponseText,
      componentData,
      usage: response.usage,
      toolCalls: toolCallsInfo,
      contextInfo: {
        workflowId: workflowId || null,
        crustdataUsed: toolCallsInfo.length > 0,
        hasComponent: !!componentData
      }
    });

  } catch (error) {
    console.error('ChatGPT API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to get response from ChatGPT',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'ConsultGPT - AI Consulting Assistant API with ChatGPT + Crustdata',
    endpoint: '/api/chat',
    method: 'POST',
    capabilities: [
      'Context-aware consulting conversations',
      'Chat history integration',
      'Real-time company and people data via Crustdata',
      'Function calling for market intelligence',
      'Competitive analysis and market research',
      'Talent scouting and organizational analysis',
      'Strategic insights and recommendations'
    ],
    inputOptions: {
      message: 'Single message string (alternative to messages array)',
      messages: 'Array of conversation messages',
      chatId: 'Optional: Chat ID for conversation context',
      conversationContext: 'Optional: "general_chat" (default)'
    },
    responseFormat: {
      response: 'ChatGPT response text',
      contextInfo: 'Analysis context metadata',
      usage: 'ChatGPT API usage statistics',
      toolCalls: 'Array of Crustdata tools used (if any)'
    },
    examples: {
      basicMessage: {
        message: 'Help me analyze the SaaS market in North America'
      },
      crustdataQuery: {
        message: 'Find fast-growing tech companies with 50+ employees in San Francisco',
        chatId: 'chat_123'
      },
      competitiveAnalysis: {
        message: 'Analyze the competitive landscape for AI-powered customer service tools',
        chatId: 'chat_123'
      },
      talentScouting: {
        message: 'Find senior engineers at Google and Microsoft with AI/ML expertise',
        chatId: 'chat_123'
      },
      conversation: {
        messages: [
          { role: 'user', content: 'What are the key trends in the fintech sector?' },
          { role: 'assistant', content: 'Based on recent market data...' },
          { role: 'user', content: 'Which companies are leading in this space?' }
        ],
        chatId: 'chat_123'
      }
    },
    crustdataTools: [
      'screen_companies - Find companies by growth, funding, location',
      'enrich_companies - Get detailed company information',
      'search_people - Find professionals by role, company, skills',
      'enrich_people - Get detailed professional profiles',
      'get_linkedin_posts - Recent social media activity',
      'get_company_people - List employees at a company'
    ]
  });
}
