import { NextResponse } from 'next/server';
import { CrustDataService } from '@/lib/crustdata';

export async function GET() {
  try {
    if (!process.env.CRUSTDATA_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'CRUSTDATA_API_KEY not configured',
        message: 'Please add CRUSTDATA_API_KEY to your .env.local file'
      }, { status: 500 });
    }

    const crustdataService = new CrustDataService(process.env.CRUSTDATA_API_KEY);

    // Test 1: Screen companies
    console.log('Testing company screening...');
    const companies = await crustdataService.screenCompanies({
      headcount: { min: 50 },
      headcountGrowth: { min: 10 },
      location: ['USA']
    });

    // Test 2: Enrich a company
    console.log('Testing company enrichment...');
    const enrichedCompanies = await crustdataService.enrichCompanies({
      companyNames: ['Hubspot'],
      fields: 'company_name,headcount,total_funding_raised_usd'
    });

    return NextResponse.json({
      success: true,
      message: 'Crustdata integration test successful',
      tests: {
        companyScreening: {
          status: 'success',
          resultCount: companies.rows?.length || 0,
          sample: companies.rows?.slice(0, 2) || []
        },
        companyEnrichment: {
          status: 'success',
          data: enrichedCompanies
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Crustdata test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
