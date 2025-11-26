// Crustdata API Service
// Provides access to real-time company and people data

export interface CompanyScreenFilters {
  headcount?: { min?: number; max?: number };
  headcountGrowth?: { min?: number; max?: number };
  funding?: { min?: number; max?: number };
  location?: string[];
  industry?: string[];
  foundedAfter?: string;
}

export interface CompanyEnrichParams {
  companyNames?: string[];
  domains?: string[];
  linkedinUrls?: string[];
  companyIds?: number[];
  fields?: string;
  enrichRealtime?: boolean;
}

export interface PeopleSearchFilters {
  currentCompany?: string[];
  title?: string[];
  location?: string[];
  skills?: string[];
  limit?: number;
  page?: number;
}

export interface PeopleEnrichParams {
  linkedinUrls?: string[];
  emails?: string[];
  enrichRealtime?: boolean;
}

export interface LinkedInPostsParams {
  personLinkedinUrl?: string;
  companyName?: string;
  companyDomain?: string;
  companyId?: number;
  limit?: number;
  page?: number;
}

export class CrustDataService {
  private apiKey: string;
  private baseUrl = 'https://api.crustdata.com';

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Crustdata API key is required');
    }
    this.apiKey = apiKey;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': `Token ${this.apiKey}`,
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Crustdata API error (${response.status}): ${errorText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Crustdata API request failed:', error);
      throw error;
    }
  }

  /**
   * Screen companies based on various filters
   * Returns a list of companies matching the criteria
   */
  async screenCompanies(filters: CompanyScreenFilters) {
    const conditions = [];

    // Use correct column name: headcount.linkedin_headcount
    if (filters.headcount?.min) {
      conditions.push({
        column: 'headcount.linkedin_headcount',
        type: '>=',
        value: filters.headcount.min
      });
    }

    if (filters.headcount?.max) {
      conditions.push({
        column: 'headcount.linkedin_headcount',
        type: '<=',
        value: filters.headcount.max
      });
    }

    // Use correct column name for growth rate
    if (filters.headcountGrowth?.min) {
      conditions.push({
        column: 'headcount.linkedin_headcount_total_growth_percent.yoy',
        type: '>=',
        value: filters.headcountGrowth.min
      });
    }

    // Use correct column name for funding
    if (filters.funding?.min) {
      conditions.push({
        column: 'funding_and_investment.crunchbase_total_investment_usd',
        type: '>=',
        value: filters.funding.min
      });
    }

    // Use correct column name for location
    // For city-level filtering, use hq_country and filter for USA, then rely on enrichment
    // or use largest_headcount_country for broader matching
    if (filters.location?.length) {
      // Try hq_country first (e.g., "USA", "Canada")
      conditions.push({
        column: 'hq_country',
        type: '(.)',  // Contains, case insensitive
        value: filters.location[0]
      });
    }

    if (filters.foundedAfter) {
      conditions.push({
        column: 'year_founded',
        type: '>=',
        value: filters.foundedAfter
      });
    }

    const requestBody = {
      filters: {
        op: 'and',
        conditions
      },
      offset: 0,
      count: 100
    };

    console.log('📤 Crustdata API Request:', JSON.stringify(requestBody, null, 2));

    const result = await this.makeRequest('/screener/screen/', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });

    console.log('📥 Crustdata API Response:', JSON.stringify({
      fields: result.fields?.length || 0,
      rows: result.rows?.length || 0
    }));

    return result;
  }

  /**
   * Enrich company data with detailed information
   * Can query by company name, domain, LinkedIn URL, or company ID
   */
  async enrichCompanies(params: CompanyEnrichParams) {
    const searchParams = new URLSearchParams();
    
    if (params.companyNames?.length) {
      searchParams.set('company_name', params.companyNames.join(','));
    }
    
    if (params.domains?.length) {
      searchParams.set('company_domain', params.domains.join(','));
    }
    
    if (params.linkedinUrls?.length) {
      searchParams.set('company_linkedin_url', params.linkedinUrls.join(','));
    }

    if (params.companyIds?.length) {
      searchParams.set('company_id', params.companyIds.join(','));
    }
    
    if (params.fields) {
      searchParams.set('fields', params.fields);
    }

    if (params.enrichRealtime !== undefined) {
      searchParams.set('enrich_realtime', params.enrichRealtime.toString());
    }

    return this.makeRequest(`/screener/company?${searchParams.toString()}`);
  }

  /**
   * Search for people based on various criteria
   * Returns profiles matching the search filters
   */
  async searchPeople(filters: PeopleSearchFilters) {
    const filterConditions = [];

    if (filters.currentCompany?.length) {
      filterConditions.push({
        filter_type: 'CURRENT_COMPANY',
        type: 'in',
        value: filters.currentCompany
      });
    }

    if (filters.title?.length) {
      filterConditions.push({
        filter_type: 'CURRENT_TITLE',
        type: 'in',
        value: filters.title
      });
    }

    if (filters.location?.length) {
      filterConditions.push({
        filter_type: 'LOCATION',
        type: 'in',
        value: filters.location
      });
    }

    return this.makeRequest('/screener/person/search', {
      method: 'POST',
      body: JSON.stringify({
        filters: filterConditions,
        limit: filters.limit || 25,
        page: filters.page || 1
      })
    });
  }

  /**
   * Enrich people data with detailed professional information
   * Can query by LinkedIn URL or business email
   */
  async enrichPeople(params: PeopleEnrichParams) {
    const searchParams = new URLSearchParams();
    
    if (params.linkedinUrls?.length) {
      searchParams.set('linkedin_profile_url', params.linkedinUrls.join(','));
    }
    
    if (params.emails?.length) {
      searchParams.set('business_email', params.emails.join(','));
    }

    if (params.enrichRealtime !== undefined) {
      searchParams.set('enrich_realtime', params.enrichRealtime.toString());
    }

    return this.makeRequest(`/screener/person/enrich?${searchParams.toString()}`);
  }

  /**
   * Get recent LinkedIn posts for a person or company
   * Includes engagement metrics and reactor information
   */
  async getLinkedInPosts(params: LinkedInPostsParams) {
    const searchParams = new URLSearchParams();
    
    if (params.personLinkedinUrl) {
      searchParams.set('person_linkedin_url', params.personLinkedinUrl);
    }
    
    if (params.companyName) {
      searchParams.set('company_name', params.companyName);
    }
    
    if (params.companyDomain) {
      searchParams.set('company_domain', params.companyDomain);
    }

    if (params.companyId) {
      searchParams.set('company_id', params.companyId.toString());
    }
    
    if (params.limit) {
      searchParams.set('limit', params.limit.toString());
    }

    if (params.page) {
      searchParams.set('page', params.page.toString());
    }

    return this.makeRequest(`/screener/linkedin_posts?${searchParams.toString()}`);
  }

  /**
   * Get people associated with a specific company
   */
  async getCompanyPeople(params: {
    companyLinkedinId?: string;
    companyId?: number;
    companyName?: string;
    s3Username: string; // REQUIRED by API
  }) {
    const searchParams = new URLSearchParams();
    
    if (params.companyLinkedinId) {
      searchParams.set('company_linkedin_id', params.companyLinkedinId);
    }
    
    if (params.companyId) {
      searchParams.set('company_id', params.companyId.toString());
    }
    
    if (params.companyName) {
      searchParams.set('company_name', params.companyName);
    }

    // Required parameter
    searchParams.set('s3_username', params.s3Username);

    return this.makeRequest(`/screener/company/people?${searchParams.toString()}`);
  }
}
