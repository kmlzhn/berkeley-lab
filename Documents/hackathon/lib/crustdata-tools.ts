// ChatGPT Function Tools for Crustdata Integration
// Defines the function schemas that ChatGPT can call to access Crustdata

export const crustdataTools = [
  {
    type: "function" as const,
    function: {
      name: "screen_companies",
      description: "Find companies matching specific criteria. Use this to discover companies for market research or prospecting. Note: Growth rate is year-over-year percentage (e.g., 20 for 20% growth). Location should be city name (e.g., 'San Francisco').",
      parameters: {
        type: "object",
        properties: {
          minHeadcount: {
            type: "number",
            description: "Minimum number of employees (e.g., 50 for mid-size companies)"
          },
          maxHeadcount: {
            type: "number", 
            description: "Maximum number of employees"
          },
          minGrowthRate: {
            type: "number",
            description: "Minimum year-over-year growth rate as a percentage (e.g., 10 for 10% growth)"
          },
          minFunding: {
            type: "number",
            description: "Minimum total funding raised in USD (e.g., 5000000 for $5M)"
          },
          location: {
            type: "array",
            items: { type: "string" },
            description: "List of COUNTRIES only (e.g., ['USA', 'Canada']). NOTE: City-level filtering (like 'San Francisco') is NOT supported by the screener. Filter by country first, then enrich companies to get detailed city information."
          },
          foundedAfter: {
            type: "string",
            description: "Find companies founded after this date (format: YYYY-MM-DD)"
          }
        },
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "enrich_companies",
      description: "Get detailed information about specific companies including financials, headcount, growth metrics, and social profiles. Use this when users ask about specific companies. Common useful fields: company_name, domains, headcount.linkedin_headcount, funding_and_investment.crunchbase_total_investment_usd, year_founded, hq_country, employee_count_range, estimated_revenue_lower_bound_usd, estimated_revenue_higher_bound_usd, headcount.linkedin_headcount_total_growth_percent.yoy",
      parameters: {
        type: "object",
        properties: {
          companyNames: {
            type: "array",
            items: { type: "string" },
            description: "List of company names (e.g., ['Hubspot', 'Github'])"
          },
          domains: {
            type: "array",
            items: { type: "string" },
            description: "List of company domains (e.g., ['hubspot.com', 'github.com'])"
          },
          linkedinUrls: {
            type: "array",
            items: { type: "string" },
            description: "List of LinkedIn company URLs"
          },
          companyIds: {
            type: "array",
            items: { type: "number" },
            description: "List of Crustdata company IDs (e.g., [12345, 67890])"
          },
          fields: {
            type: "string",
            description: "Comma-separated field names. Use correct API field names like: company_name, domains, headcount.linkedin_headcount, funding_and_investment.crunchbase_total_investment_usd, year_founded, hq_country, estimated_revenue_lower_bound_usd, headcount.linkedin_headcount_total_growth_percent.yoy. Leave empty to get all default fields."
          }
        }
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "search_people",
      description: "Find people based on their current company, job title, location, or skills. Use this for talent scouting, finding decision makers, or researching professionals.",
      parameters: {
        type: "object",
        properties: {
          currentCompany: {
            type: "array",
            items: { type: "string" },
            description: "List of current companies (e.g., ['Google', 'Microsoft'])"
          },
          title: {
            type: "array",
            items: { type: "string" },
            description: "List of job titles (e.g., ['Software Engineer', 'Product Manager'])"
          },
          location: {
            type: "array",
            items: { type: "string" },
            description: "List of locations (e.g., ['San Francisco', 'New York'])"
          },
          skills: {
            type: "array",
            items: { type: "string" },
            description: "List of skills to filter by"
          },
          limit: {
            type: "number",
            description: "Maximum number of results to return (default: 25, max: 25)"
          }
        }
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "enrich_people",
      description: "Get detailed professional information about specific people including work history, education, skills, and contact information. Use this when users ask about specific individuals.",
      parameters: {
        type: "object",
        properties: {
          linkedinUrls: {
            type: "array",
            items: { type: "string" },
            description: "List of LinkedIn profile URLs"
          },
          emails: {
            type: "array",
            items: { type: "string" },
            description: "List of business email addresses"
          }
        }
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "get_linkedin_posts",
      description: "Get recent LinkedIn posts and engagement metrics for a person or company. Use this to understand recent activity, thought leadership, or company announcements.",
      parameters: {
        type: "object",
        properties: {
          personLinkedinUrl: {
            type: "string",
            description: "LinkedIn profile URL of the person"
          },
          companyName: {
            type: "string",
            description: "Name of the company"
          },
          companyDomain: {
            type: "string",
            description: "Domain of the company (e.g., 'hubspot.com')"
          },
          limit: {
            type: "number",
            description: "Number of posts to retrieve (default: 10, max: 25)"
          }
        }
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "get_company_people",
      description: "Get a list of people working at a specific company. Use this to find employees, decision makers, or build org charts.",
      parameters: {
        type: "object",
        properties: {
          companyName: {
            type: "string",
            description: "Name of the company"
          },
          companyLinkedinId: {
            type: "string",
            description: "LinkedIn ID of the company"
          },
          companyId: {
            type: "number",
            description: "Crustdata company ID"
          },
          s3Username: {
            type: "string",
            description: "S3 username for data access (required by API)"
          }
        },
        required: ["s3Username"]
      }
    }
  }
];
