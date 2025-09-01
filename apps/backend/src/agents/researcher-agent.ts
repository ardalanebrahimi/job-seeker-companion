import { BaseAgent, AgentContext, AgentResponse } from "./base-agent";

export interface ResearchRequest {
  companyId: string;
  type: "snapshot" | "brochure";
  includeNews?: boolean;
  includeBasicInfo?: boolean;
  includeProducts?: boolean;
  includeMarket?: boolean;
  includeCulture?: boolean;
  includeTimeline?: boolean;
}

export interface ResearchResult {
  name: string;
  logo?: string;
  website?: string;
  industry: string;
  size?: string;
  headquarters?: string;
  summary: string;
  news?: Array<{
    title: string;
    url?: string;
    date: string;
    summary: string;
  }>;
  products?: {
    content: string;
    images?: string[];
  };
  market?: {
    content: string;
    competitors?: string[];
  };
  culture?: {
    content: string;
    values?: string[];
  };
  timeline?: Array<{
    year: number;
    event: string;
    description?: string;
  }>;
}

/**
 * ResearcherAgent - V4 Company Research
 * Gathers company information for snapshots and brochures
 */
export class ResearcherAgent extends BaseAgent {
  protected name = "ResearcherAgent";
  protected version = "1.0.0";

  async executeResearch(
    request: ResearchRequest,
    context: AgentContext
  ): Promise<AgentResponse<ResearchResult>> {
    const prompt = this.buildResearchPrompt(request);

    try {
      const response = await this.callLLM(prompt);

      const result = this.parseResearchResponse(response, request);

      return {
        success: true,
        data: result,
        metadata: {
          model: "gpt-4",
          tokens: 1500,
          duration: 2000,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "RESEARCH_FAILED",
          message: `Failed to research company: ${error.message}`,
        },
      };
    }
  }

  protected getMockResponse(): any {
    return {
      content: JSON.stringify({
        name: "Tech Corp",
        logo: "https://example.com/logo.png",
        website: "https://techcorp.com",
        industry: "Software Technology",
        size: "500-1000 employees",
        headquarters: "San Francisco, CA",
        summary:
          "Tech Corp is a leading software company specializing in enterprise solutions. They provide cloud-based platforms for businesses worldwide.",
        news: [
          {
            title: "Tech Corp Raises $50M Series B",
            url: "https://example.com/news/1",
            date: "2024-01-15",
            summary:
              "Company secures funding for expansion into European markets",
          },
        ],
        products: {
          content:
            "Tech Corp offers a comprehensive suite of enterprise software solutions including CRM, ERP, and analytics platforms.",
          images: ["https://example.com/product1.png"],
        },
        market: {
          content:
            "Operating in the competitive enterprise software market with focus on mid-market companies.",
          competitors: ["Salesforce", "Microsoft", "Oracle"],
        },
        culture: {
          content:
            "Tech Corp promotes innovation, collaboration, and work-life balance with remote-first approach.",
          values: [
            "Innovation",
            "Collaboration",
            "Integrity",
            "Customer Success",
          ],
        },
        timeline: [
          {
            year: 2015,
            event: "Company Founded",
            description: "Started as a small team in San Francisco",
          },
          {
            year: 2020,
            event: "Series A Funding",
            description: "Raised $10M Series A",
          },
          {
            year: 2024,
            event: "Series B Funding",
            description: "Raised $50M Series B",
          },
        ],
      }),
    };
  }

  private buildResearchPrompt(request: ResearchRequest): string {
    let prompt = `You are a company research specialist. Research the company with ID: ${request.companyId}.\n\n`;

    if (request.type === "snapshot") {
      prompt += `Generate a company snapshot including:\n`;
      if (request.includeBasicInfo) {
        prompt += `- Basic company information (name, industry, size, headquarters, website)\n`;
      }
      prompt += `- A 2-3 sentence summary of products/services\n`;
      if (request.includeNews) {
        prompt += `- Recent news or public signals (funding, expansion, etc.)\n`;
      }
    } else if (request.type === "brochure") {
      prompt += `Generate detailed company brochure content including:\n`;
      if (request.includeProducts) {
        prompt += `- Products & Services section with detailed content\n`;
      }
      if (request.includeMarket) {
        prompt += `- Market & Competition analysis\n`;
      }
      if (request.includeCulture) {
        prompt += `- Company culture and values\n`;
      }
      if (request.includeTimeline) {
        prompt += `- Company timeline with major milestones\n`;
      }
    }

    prompt += `\nProvide a comprehensive response based on publicly available information. Format the response as JSON with the following structure:\n`;

    if (request.type === "snapshot") {
      prompt += `{
  "name": "Company Name",
  "logo": "URL to logo (optional)",
  "website": "https://company.com",
  "industry": "Industry name",
  "size": "Employee count range",
  "headquarters": "City, Country",
  "summary": "2-3 sentence summary",
  "news": [
    {
      "title": "News title",
      "url": "News URL (optional)",
      "date": "YYYY-MM-DD",
      "summary": "Brief summary"
    }
  ]
}`;
    } else {
      prompt += `{
  "name": "Company Name",
  "industry": "Industry name",
  "summary": "Company summary",
  "products": {
    "content": "Detailed products description",
    "images": ["URL1", "URL2"]
  },
  "market": {
    "content": "Market analysis",
    "competitors": ["Competitor1", "Competitor2"]
  },
  "culture": {
    "content": "Culture description",
    "values": ["Value1", "Value2"]
  },
  "timeline": [
    {
      "year": 2020,
      "event": "Major milestone",
      "description": "Description"
    }
  ]
}`;
    }

    return prompt;
  }

  private parseResearchResponse(
    response: any,
    request: ResearchRequest
  ): ResearchResult {
    try {
      const parsed = JSON.parse(response.content || response.text || response);

      // Ensure required fields are present
      const result: ResearchResult = {
        name: parsed.name || "Unknown Company",
        industry: parsed.industry || "Unknown",
        summary: parsed.summary || "No summary available",
        logo: parsed.logo,
        website: parsed.website,
        size: parsed.size,
        headquarters: parsed.headquarters,
      };

      // Add optional fields based on request type
      if (request.includeNews && parsed.news) {
        result.news = parsed.news;
      }

      if (request.includeProducts && parsed.products) {
        result.products = parsed.products;
      }

      if (request.includeMarket && parsed.market) {
        result.market = parsed.market;
      }

      if (request.includeCulture && parsed.culture) {
        result.culture = parsed.culture;
      }

      if (request.includeTimeline && parsed.timeline) {
        result.timeline = parsed.timeline;
      }

      return result;
    } catch (error) {
      // Fallback if JSON parsing fails
      return {
        name: "Unknown Company",
        industry: "Unknown",
        summary: "Research data unavailable",
      };
    }
  }
}
