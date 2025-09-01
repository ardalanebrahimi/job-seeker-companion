import { Component, OnInit, input, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";

// Mock types for demonstration (in production these would come from SDK)
interface CompanySnapshot {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  industry: string;
  size?: string;
  headquarters?: string;
  summary: string;
  recentNews: Array<{
    title: string;
    url?: string;
    date: string;
    summary: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface CompanyBrochure {
  id: string;
  companyId: string;
  snapshot: CompanySnapshot;
  sections: {
    products?: {
      title: string;
      content: string;
      images?: string[];
    };
    market?: {
      title: string;
      content: string;
      competitors?: string[];
    };
    culture?: {
      title: string;
      content: string;
      values?: string[];
    };
    timeline?: Array<{
      year: number;
      event: string;
      description?: string;
    }>;
  };
  exportUrl?: string;
  createdAt: string;
}

@Component({
  selector: "app-company-brochure",
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Loading State -->
    <div *ngIf="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Loading company information...</p>
    </div>

    <!-- Error State -->
    <div *ngIf="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <button (click)="loadCompanyData()" class="retry-button">
        Try Again
      </button>
    </div>

    <!-- Main Content -->
    <div *ngIf="!loading && !error && brochure" class="company-brochure">
      <!-- Header -->
      <div class="brochure-header">
        <h1>{{ brochure.snapshot.name }}</h1>
        <p class="industry">{{ brochure.snapshot.industry }}</p>
        <button
          *ngIf="brochure.exportUrl"
          (click)="exportBrochure()"
          class="export-button"
        >
          📄 Export Brochure
        </button>
      </div>

      <!-- Company Overview -->
      <div class="section company-overview">
        <h2>Company Overview</h2>
        <div class="overview-content">
          <div class="company-details">
            <img
              *ngIf="brochure.snapshot.logo"
              [src]="brochure.snapshot.logo"
              [alt]="brochure.snapshot.name + ' logo'"
              class="company-logo"
            />
            <div class="details-text">
              <p class="summary">{{ brochure.snapshot.summary }}</p>
              <div class="company-facts">
                <div *ngIf="brochure.snapshot.size" class="fact">
                  <strong>Size:</strong> {{ brochure.snapshot.size }}
                </div>
                <div *ngIf="brochure.snapshot.headquarters" class="fact">
                  <strong>Headquarters:</strong>
                  {{ brochure.snapshot.headquarters }}
                </div>
                <div *ngIf="brochure.snapshot.website" class="fact">
                  <strong>Website:</strong>
                  <a [href]="brochure.snapshot.website" target="_blank">{{
                    brochure.snapshot.website
                  }}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Products Section -->
      <div *ngIf="brochure.sections.products" class="section products-section">
        <h2>{{ brochure.sections.products.title }}</h2>
        <div class="section-content">
          <p>{{ brochure.sections.products.content }}</p>
          <div
            *ngIf="
              brochure.sections.products.images &&
              brochure.sections.products.images.length > 0
            "
            class="product-images"
          >
            <img
              *ngFor="let image of brochure.sections.products.images"
              [src]="image"
              [alt]="'Product image'"
              class="product-image"
            />
          </div>
        </div>
      </div>

      <!-- Market Section -->
      <div *ngIf="brochure.sections.market" class="section market-section">
        <h2>{{ brochure.sections.market.title }}</h2>
        <div class="section-content">
          <p>{{ brochure.sections.market.content }}</p>
          <div
            *ngIf="
              brochure.sections.market.competitors &&
              brochure.sections.market.competitors.length > 0
            "
            class="competitors"
          >
            <h3>Key Competitors</h3>
            <div class="competitor-list">
              <span
                *ngFor="let competitor of brochure.sections.market.competitors"
                class="competitor-tag"
                >{{ competitor }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Culture Section -->
      <div *ngIf="brochure.sections.culture" class="section culture-section">
        <h2>{{ brochure.sections.culture.title }}</h2>
        <div class="section-content">
          <p>{{ brochure.sections.culture.content }}</p>
          <div
            *ngIf="
              brochure.sections.culture.values &&
              brochure.sections.culture.values.length > 0
            "
            class="values"
          >
            <h3>Core Values</h3>
            <div class="values-list">
              <span
                *ngFor="let value of brochure.sections.culture.values"
                class="value-tag"
                >{{ value }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Timeline Section -->
      <div
        *ngIf="
          brochure.sections.timeline && brochure.sections.timeline.length > 0
        "
        class="section timeline-section"
      >
        <h2>Company Timeline</h2>
        <div class="timeline">
          <div
            *ngFor="let event of brochure.sections.timeline"
            class="timeline-item"
          >
            <div class="timeline-year">{{ event.year }}</div>
            <div class="timeline-content">
              <h3>{{ event.event }}</h3>
              <p *ngIf="event.description">{{ event.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent News -->
      <div
        *ngIf="
          brochure.snapshot.recentNews &&
          brochure.snapshot.recentNews.length > 0
        "
        class="section news-section"
      >
        <h2>Recent News</h2>
        <div class="news-grid">
          <div
            *ngFor="let news of brochure.snapshot.recentNews"
            class="news-item"
          >
            <div class="news-header">
              <h3>{{ news.title }}</h3>
              <span class="news-date">{{ formatDate(news.date) }}</span>
            </div>
            <p>{{ news.summary }}</p>
            <a
              *ngIf="news.url"
              [href]="news.url"
              target="_blank"
              class="news-link"
              >Read more →</a
            >
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .company-brochure {
        max-width: 1000px;
        margin: 0 auto;
        padding: 2rem;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          sans-serif;
      }

      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 400px;
        gap: 1rem;
      }

      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #007bff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      .error-container {
        text-align: center;
        padding: 2rem;
        background: #fee;
        border: 1px solid #fcc;
        border-radius: 8px;
        margin: 1rem 0;
      }

      .error-message {
        color: #d00;
        margin-bottom: 1rem;
      }

      .retry-button {
        background: #007bff;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
      }

      .brochure-header {
        text-align: center;
        margin-bottom: 3rem;
        position: relative;
      }

      .brochure-header h1 {
        font-size: 3rem;
        color: #333;
        margin-bottom: 0.5rem;
      }

      .industry {
        font-size: 1.2rem;
        color: #666;
        margin-bottom: 1.5rem;
      }

      .export-button {
        background: #28a745;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
        position: absolute;
        top: 0;
        right: 0;
      }

      .section {
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        padding: 2rem;
        margin-bottom: 2rem;
      }

      .section h2 {
        color: #333;
        font-size: 1.8rem;
        margin-bottom: 1.5rem;
        border-bottom: 2px solid #f0f0f0;
        padding-bottom: 0.5rem;
      }

      .company-details {
        display: flex;
        gap: 2rem;
        align-items: flex-start;
      }

      .company-logo {
        width: 120px;
        height: 120px;
        object-fit: contain;
        border-radius: 8px;
        border: 1px solid #e9ecef;
      }

      .details-text {
        flex: 1;
      }

      .summary {
        font-size: 1.1rem;
        line-height: 1.6;
        color: #555;
        margin-bottom: 1.5rem;
      }

      .company-facts {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .fact {
        color: #666;
      }

      .fact strong {
        color: #333;
      }

      .fact a {
        color: #007bff;
        text-decoration: none;
      }

      .section-content p {
        line-height: 1.6;
        color: #555;
        margin-bottom: 1.5rem;
      }

      .product-images {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
      }

      .product-image {
        width: 100%;
        height: 150px;
        object-fit: cover;
        border-radius: 8px;
        border: 1px solid #e9ecef;
      }

      .competitors,
      .values {
        margin-top: 1.5rem;
      }

      .competitors h3,
      .values h3 {
        color: #333;
        margin-bottom: 1rem;
      }

      .competitor-list,
      .values-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .competitor-tag,
      .value-tag {
        background: #f8f9fa;
        color: #495057;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        border: 1px solid #dee2e6;
        font-size: 0.9rem;
      }

      .timeline {
        position: relative;
        padding-left: 2rem;
      }

      .timeline::before {
        content: "";
        position: absolute;
        left: 1rem;
        top: 0;
        bottom: 0;
        width: 2px;
        background: #dee2e6;
      }

      .timeline-item {
        position: relative;
        margin-bottom: 2rem;
        padding-left: 2rem;
      }

      .timeline-item::before {
        content: "";
        position: absolute;
        left: -1.5rem;
        top: 0.5rem;
        width: 12px;
        height: 12px;
        background: #007bff;
        border-radius: 50%;
      }

      .timeline-year {
        font-weight: bold;
        color: #007bff;
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
      }

      .timeline-content h3 {
        color: #333;
        margin-bottom: 0.5rem;
      }

      .timeline-content p {
        color: #666;
        margin: 0;
      }

      .news-grid {
        display: grid;
        gap: 1.5rem;
      }

      .news-item {
        border: 1px solid #e9ecef;
        border-radius: 8px;
        padding: 1.5rem;
        background: #fafafa;
      }

      .news-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
      }

      .news-header h3 {
        margin: 0;
        color: #333;
        font-size: 1.2rem;
      }

      .news-date {
        color: #666;
        font-size: 0.9rem;
      }

      .news-item p {
        margin: 0 0 1rem 0;
        color: #555;
      }

      .news-link {
        color: #007bff;
        text-decoration: none;
        font-weight: 500;
      }

      .news-link:hover {
        text-decoration: underline;
      }

      @media (max-width: 768px) {
        .company-brochure {
          padding: 1rem;
        }

        .brochure-header h1 {
          font-size: 2rem;
        }

        .export-button {
          position: static;
          margin-top: 1rem;
        }

        .company-details {
          flex-direction: column;
          text-align: center;
        }

        .timeline {
          padding-left: 1rem;
        }

        .timeline::before {
          left: 0.5rem;
        }

        .timeline-item {
          padding-left: 1.5rem;
        }

        .timeline-item::before {
          left: -1rem;
        }
      }
    `,
  ],
})
export class CompanyBrochureComponent implements OnInit {
  companyId = input<string>("");

  snapshot: CompanySnapshot | null = null;
  brochure: CompanyBrochure | null = null;
  loading = false;
  error: string | null = null;

  private route = inject(ActivatedRoute);

  ngOnInit() {
    // Get companyId from route params if not provided as input
    const routeCompanyId = this.route.snapshot.paramMap.get('id');
    const compId = this.companyId() || routeCompanyId;
    
    if (compId) {
      this.loadCompanyData(compId);
    }
  }

  async loadCompanyData(companyId?: string) {
    const targetCompanyId = companyId || this.companyId();
    if (!targetCompanyId) return;

    this.loading = true;
    this.error = null;

    try {
      // Mock data for demonstration - in production this would call the actual API
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      const mockSnapshot: CompanySnapshot = {
        id: targetCompanyId,
        name: "Tech Corp",
        logo: "https://via.placeholder.com/120x120?text=TC",
        website: "https://techcorp.com",
        industry: "Software Technology",
        size: "500-1000 employees",
        headquarters: "San Francisco, CA",
        summary:
          "Tech Corp is a leading software company specializing in enterprise solutions. They provide cloud-based platforms for businesses worldwide, focusing on innovation and customer success.",
        recentNews: [
          {
            title: "Tech Corp Raises $50M Series B",
            url: "https://example.com/news/1",
            date: "2024-01-15",
            summary:
              "Company secures funding for expansion into European markets and AI development",
          },
          {
            title: "New Product Launch: AI Analytics Platform",
            date: "2024-02-01",
            summary:
              "Revolutionary analytics platform using machine learning to provide business insights",
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockBrochure: CompanyBrochure = {
        id: `brochure-${targetCompanyId}`,
        companyId: targetCompanyId,
        snapshot: mockSnapshot,
        sections: {
          products: {
            title: "Products & Services",
            content:
              "Tech Corp offers a comprehensive suite of enterprise software solutions including CRM, ERP, and analytics platforms. Our cloud-based infrastructure ensures scalability and reliability for businesses of all sizes.",
            images: [
              "https://via.placeholder.com/300x200?text=Product+1",
              "https://via.placeholder.com/300x200?text=Product+2",
            ],
          },
          market: {
            title: "Market & Competition",
            content:
              "Operating in the competitive enterprise software market with a focus on mid-market companies. We differentiate through superior user experience and comprehensive integrations.",
            competitors: ["Salesforce", "Microsoft", "Oracle", "SAP"],
          },
          culture: {
            title: "Culture & Values",
            content:
              "Tech Corp promotes innovation, collaboration, and work-life balance with a remote-first approach. We believe in empowering our employees to do their best work while maintaining a healthy work-life integration.",
            values: [
              "Innovation",
              "Collaboration",
              "Integrity",
              "Customer Success",
              "Continuous Learning",
            ],
          },
          timeline: [
            {
              year: 2015,
              event: "Company Founded",
              description:
                "Started as a small team in San Francisco with a vision to revolutionize enterprise software",
            },
            {
              year: 2018,
              event: "First Major Client Win",
              description:
                "Secured partnership with Fortune 500 company, validating our enterprise approach",
            },
            {
              year: 2020,
              event: "Series A Funding",
              description:
                "Raised $10M Series A to accelerate product development and team growth",
            },
            {
              year: 2022,
              event: "International Expansion",
              description:
                "Opened European headquarters and began serving international markets",
            },
            {
              year: 2024,
              event: "Series B Funding",
              description:
                "Raised $50M Series B to fuel AI development and market expansion",
            },
          ],
        },
        exportUrl: `https://storage.example.com/brochures/${targetCompanyId}.pdf`,
        createdAt: new Date().toISOString(),
      };

      this.snapshot = mockSnapshot;
      this.brochure = mockBrochure;
    } catch (err) {
      this.error = "Failed to load company information";
      console.error("Error loading company data:", err);
    } finally {
      this.loading = false;
    }
  }

  exportBrochure() {
    if (this.brochure?.exportUrl) {
      window.open(this.brochure.exportUrl, "_blank");
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}
