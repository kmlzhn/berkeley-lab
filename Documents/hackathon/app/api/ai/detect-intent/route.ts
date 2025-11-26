import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  let requestBody;
  
  try {
    // Parse request body once and store it
    requestBody = await request.json();
    const { message } = requestBody;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-5',
      max_completion_tokens: 20,
      messages: [{
        role: 'user',
        content: `Classify this user message intent. Return ONLY one of these exact options:

"${message}"

Options:
- company_research (finding/analyzing companies, market research)
- people_search (finding talent, executives, professionals)
- competitive_analysis (competitor research, market positioning)
- market_sizing (TAM/SAM/SOM, market calculations)
- follow_up_question (questions about previous results)
- general_chat (general conversation, greetings, other topics)

Return ONLY the option name:`
      }]
    });
    
    const intent = response.choices[0].message.content?.trim() || '';
    
    // Validate the response is one of our expected intents
    const validIntents = [
      'company_research', 
      'people_search', 
      'competitive_analysis', 
      'market_sizing', 
      'follow_up_question', 
      'general_chat'
    ];
    
    const detectedIntent = validIntents.includes(intent) ? intent : 'general_chat';
    
    return NextResponse.json({ 
      intent: detectedIntent 
    });

  } catch (error) {
    console.error('AI intent detection failed:', error);
    
    // Use already parsed body or create fallback
    const message = requestBody?.message;
    const content = message?.toLowerCase() || '';
    
    let fallbackIntent = 'general_chat';
    if (content.includes('company') || content.includes('companies') || content.includes('find')) {
      fallbackIntent = 'company_research';
    } else if (content.includes('people') || content.includes('talent') || content.includes('engineer')) {
      fallbackIntent = 'people_search';
    } else if (content.includes('competitor') || content.includes('competitive')) {
      fallbackIntent = 'competitive_analysis';
    } else if (content.includes('market') || content.includes('tam') || content.includes('sizing')) {
      fallbackIntent = 'market_sizing';
    }
    
    return NextResponse.json({ 
      intent: fallbackIntent
    });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'AI Intent Detection API',
    description: 'POST /api/ai/detect-intent with { message: string }',
    validIntents: [
      'company_research', 
      'people_search', 
      'competitive_analysis', 
      'market_sizing', 
      'follow_up_question', 
      'general_chat'
    ],
    example: {
      input: { message: "Find tech companies in SF" },
      output: { intent: "company_research" }
    }
  });
}
