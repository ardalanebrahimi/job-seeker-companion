import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

interface JobIngestResponse {
  jobId: string;
}

interface JobDetail {
  id: string;
  company?: string;
  title?: string;
  location?: string;
  jdText: string;
  jdStruct?: {
    skills?: string[];
    requirements?: string[];
    niceToHave?: string[];
    seniority?: string;
  };
  firstSeenAt: string;
}

interface GeneratedDoc {
  kind: "cv" | "cover" | "brochure" | "prep";
  format: "md" | "docx" | "pdf";
  uri: string;
  variantLabel?: string;
  language?: string;
}

interface ApplicationGenerateResponse {
  applicationId: string;
  docs: GeneratedDoc[];
  decision?: {
    persona?: string;
    realityIndex?: number;
    signals?: string[];
    keywordsEmphasized?: string[];
  };
}

interface GapRoadmap {
  matchScore: number;
  mustHaveGaps: string[];
  niceToHaveGaps: string[];
  actions: Array<{
    title: string;
    description: string;
    etaDays: number;
  }>;
}

@Component({
  selector: "app-generate",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="generate-page">
      <h2>Generate Tailored Application</h2>

      <!-- Job Input Section -->
      <div class="card" *ngIf="!jobDetail() && !isProcessing()">
        <h3>Add Job Description</h3>

        <div class="input-tabs">
          <button
            type="button"
            class="tab"
            [class.active]="inputMode() === 'text'"
            (click)="inputMode.set('text')"
          >
            Paste Text
          </button>
          <button
            type="button"
            class="tab"
            [class.active]="inputMode() === 'url'"
            (click)="inputMode.set('url')"
          >
            From URL
          </button>
        </div>

        <form (ngSubmit)="ingestJob()" class="job-form">
          <div class="form-group" *ngIf="inputMode() === 'text'">
            <label for="jobText">Job Description Text</label>
            <textarea
              id="jobText"
              class="form-control"
              rows="10"
              placeholder="Paste the job description here..."
              [(ngModel)]="jobText"
              name="jobText"
              required
            ></textarea>
          </div>

          <div class="form-group" *ngIf="inputMode() === 'url'">
            <label for="jobUrl">Job Posting URL</label>
            <input
              type="url"
              id="jobUrl"
              class="form-control"
              placeholder="https://example.com/jobs/123"
              [(ngModel)]="jobUrl"
              name="jobUrl"
              required
            />
          </div>

          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="!canSubmitJob()"
          >
            Analyze Job
          </button>
        </form>
      </div>

      <!-- Loading State -->
      <div class="card" *ngIf="isProcessing()">
        <div class="loading">
          <h3>{{ processingMessage() }}</h3>
          <div class="spinner"></div>
        </div>
      </div>

      <!-- Job Analysis Section -->
      <div class="card" *ngIf="jobDetail() && !generatedApplication()">
        <h3>Job Analysis</h3>

        <div class="job-summary">
          <h4>{{ jobDetail()?.title || "Position" }}</h4>
          <p *ngIf="jobDetail()?.company">
            <strong>Company:</strong> {{ jobDetail()?.company }}
          </p>
          <p *ngIf="jobDetail()?.location">
            <strong>Location:</strong> {{ jobDetail()?.location }}
          </p>
        </div>

        <div class="job-requirements" *ngIf="jobDetail()?.jdStruct">
          <div
            class="requirements-section"
            *ngIf="jobDetail()?.jdStruct?.skills?.length"
          >
            <h5>Key Skills</h5>
            <div class="skills-list">
              <span
                class="skill-tag"
                *ngFor="let skill of jobDetail()?.jdStruct?.skills"
              >
                {{ skill }}
              </span>
            </div>
          </div>

          <div
            class="requirements-section"
            *ngIf="jobDetail()?.jdStruct?.requirements?.length"
          >
            <h5>Requirements</h5>
            <ul>
              <li *ngFor="let req of jobDetail()?.jdStruct?.requirements">
                {{ req }}
              </li>
            </ul>
          </div>
        </div>

        <div class="generation-options">
          <h4>Generation Options</h4>
          <div class="form-group">
            <label for="realityIndex">Reality Index</label>
            <select
              id="realityIndex"
              class="form-control"
              [(ngModel)]="realityIndex"
            >
              <option value="0">0 - Facts Only (Conservative)</option>
              <option value="1">1 - Balanced (Recommended)</option>
              <option value="2">2 - Aspirational (Aggressive)</option>
            </select>
            <small class="form-text">
              Controls how the system phrases your experience (0 = strict facts,
              2 = aspirational but truthful)
            </small>
          </div>

          <button
            type="button"
            class="btn btn-primary btn-large"
            (click)="generateApplication()"
          >
            Generate Tailored Documents
          </button>
        </div>
      </div>

      <!-- Generated Application Section -->
      <div class="card" *ngIf="generatedApplication()">
        <h3>Generated Application</h3>

        <div
          class="generation-summary"
          *ngIf="generatedApplication()?.decision"
        >
          <h4>Generation Details</h4>
          <p>
            <strong>Persona:</strong>
            {{ generatedApplication()?.decision?.persona }}
          </p>
          <p>
            <strong>Reality Index:</strong>
            {{ generatedApplication()?.decision?.realityIndex }}
          </p>

          <div
            class="signals"
            *ngIf="generatedApplication()?.decision?.signals?.length"
          >
            <h5>Match Signals</h5>
            <ul>
              <li
                *ngFor="let signal of generatedApplication()?.decision?.signals"
              >
                {{ signal }}
              </li>
            </ul>
          </div>

          <div
            class="emphasized-keywords"
            *ngIf="generatedApplication()?.decision?.keywordsEmphasized?.length"
          >
            <h5>Emphasized Keywords</h5>
            <div class="keywords">
              <span
                class="keyword-tag"
                *ngFor="
                  let keyword of generatedApplication()?.decision
                    ?.keywordsEmphasized
                "
              >
                {{ keyword }}
              </span>
            </div>
          </div>
        </div>

        <div class="generated-docs">
          <h4>Generated Documents</h4>
          <div class="docs-list">
            <div
              class="doc-item"
              *ngFor="let doc of generatedApplication()?.docs"
            >
              <div class="doc-info">
                <span class="doc-type">{{ formatDocType(doc.kind) }}</span>
                <span class="doc-format">{{ doc.format.toUpperCase() }}</span>
                <span class="doc-variant" *ngIf="doc.variantLabel">{{
                  doc.variantLabel
                }}</span>
              </div>
              <button
                type="button"
                class="btn btn-secondary"
                (click)="viewDocument(doc)"
              >
                View
              </button>
            </div>
          </div>
        </div>

        <div class="coaching-section">
          <h4>Coaching Insights</h4>
          <button
            type="button"
            class="btn btn-outline"
            (click)="getCoachingTips()"
            [disabled]="loadingCoaching()"
          >
            {{ loadingCoaching() ? "Loading..." : "Get Improvement Tips" }}
          </button>

          <div class="coaching-tips" *ngIf="coachingTips()">
            <div class="match-score">
              <h5>Match Score: {{ formatMatchScore() }}%</h5>
            </div>

            <div class="gaps" *ngIf="coachingTips()?.mustHaveGaps?.length">
              <h5>Critical Skills to Develop</h5>
              <ul>
                <li *ngFor="let gap of coachingTips()?.mustHaveGaps">
                  {{ gap }}
                </li>
              </ul>
            </div>

            <div class="actions" *ngIf="coachingTips()?.actions?.length">
              <h5>Recommended Actions</h5>
              <div class="action-list">
                <div
                  class="action-item"
                  *ngFor="let action of coachingTips()?.actions"
                >
                  <h6>
                    {{ action.title }}
                    <span class="eta">({{ action.etaDays }} days)</span>
                  </h6>
                  <p>{{ action.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="next-steps">
          <button
            type="button"
            class="btn btn-success"
            (click)="viewApplicationTracker()"
          >
            View in Tracker
          </button>
          <button type="button" class="btn btn-outline" (click)="startOver()">
            Generate Another
          </button>
        </div>
      </div>

      <!-- Error Display -->
      <div class="card error" *ngIf="error()">
        <h3>Error</h3>
        <p>{{ error() }}</p>
        <button type="button" class="btn btn-outline" (click)="clearError()">
          Try Again
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .generate-page {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }

      .card {
        background: white;
        border-radius: 8px;
        padding: 24px;
        margin-bottom: 20px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .card.error {
        border-left: 4px solid #dc3545;
        background-color: #fff5f5;
      }

      .input-tabs {
        display: flex;
        margin-bottom: 20px;
        border-bottom: 1px solid #ddd;
      }

      .tab {
        background: none;
        border: none;
        padding: 12px 20px;
        cursor: pointer;
        border-bottom: 2px solid transparent;
      }

      .tab.active {
        border-bottom-color: #007bff;
        color: #007bff;
      }

      .form-group {
        margin-bottom: 20px;
      }

      .form-control {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
      }

      .form-control:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
      }

      .btn {
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        text-decoration: none;
        display: inline-block;
        margin-right: 10px;
      }

      .btn-primary {
        background-color: #007bff;
        color: white;
      }

      .btn-success {
        background-color: #28a745;
        color: white;
      }

      .btn-secondary {
        background-color: #6c757d;
        color: white;
      }

      .btn-outline {
        background-color: transparent;
        color: #007bff;
        border: 1px solid #007bff;
      }

      .btn-large {
        padding: 15px 30px;
        font-size: 16px;
        font-weight: bold;
      }

      .btn:hover:not(:disabled) {
        opacity: 0.9;
        transform: translateY(-1px);
      }

      .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .loading {
        text-align: center;
        padding: 40px;
      }

      .spinner {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #007bff;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 2s linear infinite;
        margin: 20px auto;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      .job-summary h4 {
        color: #333;
        margin-bottom: 10px;
      }

      .skills-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 10px;
      }

      .skill-tag,
      .keyword-tag {
        background-color: #e3f2fd;
        color: #1976d2;
        padding: 4px 12px;
        border-radius: 16px;
        font-size: 12px;
        font-weight: 500;
      }

      .requirements-section {
        margin: 20px 0;
      }

      .requirements-section h5 {
        color: #555;
        margin-bottom: 10px;
      }

      .docs-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .doc-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }

      .doc-info {
        display: flex;
        gap: 10px;
        align-items: center;
      }

      .doc-type {
        font-weight: bold;
        text-transform: capitalize;
      }

      .doc-format {
        background-color: #f8f9fa;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 12px;
      }

      .doc-variant {
        color: #666;
        font-style: italic;
      }

      .action-list {
        margin-top: 15px;
      }

      .action-item {
        margin-bottom: 20px;
        padding: 15px;
        background-color: #f8f9fa;
        border-radius: 4px;
      }

      .action-item h6 {
        margin: 0 0 8px 0;
        color: #333;
      }

      .eta {
        color: #666;
        font-weight: normal;
        font-size: 12px;
      }

      .match-score h5 {
        color: #28a745;
        font-size: 18px;
      }

      .next-steps {
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #ddd;
      }
    `,
  ],
})
export class GeneratePageComponent {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Reactive state
  inputMode = signal<"text" | "url">("text");
  jobText = "";
  jobUrl = "";
  realityIndex = 1;

  isProcessing = signal(false);
  processingMessage = signal("");
  jobDetail = signal<JobDetail | null>(null);
  generatedApplication = signal<ApplicationGenerateResponse | null>(null);
  coachingTips = signal<GapRoadmap | null>(null);
  loadingCoaching = signal(false);
  error = signal<string | null>(null);

  canSubmitJob(): boolean {
    if (this.inputMode() === "text") {
      return this.jobText.trim().length > 50;
    } else {
      return this.jobUrl.trim().length > 0;
    }
  }

  async ingestJob() {
    if (!this.canSubmitJob()) return;

    this.isProcessing.set(true);
    this.processingMessage.set("Analyzing job description...");
    this.error.set(null);

    try {
      const request: any = {};

      if (this.inputMode() === "text") {
        request.rawText = this.jobText;
      } else {
        request.url = this.jobUrl;
      }

      // Ingest job
      const ingestResponse = await this.http
        .post<JobIngestResponse>("/api/v1/jobs/ingest", request)
        .toPromise();

      if (!ingestResponse) {
        throw new Error("Failed to ingest job");
      }

      // Get job details
      const jobDetail = await this.http
        .get<JobDetail>(`/api/v1/jobs/${ingestResponse.jobId}`)
        .toPromise();

      this.jobDetail.set(jobDetail || null);
    } catch (err: any) {
      this.error.set(
        err.error?.error?.message || "Failed to analyze job description"
      );
    } finally {
      this.isProcessing.set(false);
    }
  }

  async generateApplication() {
    const job = this.jobDetail();
    if (!job) return;

    this.isProcessing.set(true);
    this.processingMessage.set("Generating tailored documents...");
    this.error.set(null);

    try {
      const request = {
        jobId: job.id,
        realityIndex: this.realityIndex,
      };

      const response = await this.http
        .post<ApplicationGenerateResponse>(
          "/api/v1/applications/generate",
          request
        )
        .toPromise();

      this.generatedApplication.set(response || null);
    } catch (err: any) {
      this.error.set(
        err.error?.error?.message || "Failed to generate application documents"
      );
    } finally {
      this.isProcessing.set(false);
    }
  }

  async getCoachingTips() {
    const job = this.jobDetail();
    if (!job) return;

    this.loadingCoaching.set(true);
    this.error.set(null);

    try {
      const request = {
        jobId: job.id,
      };

      const response = await this.http
        .post<GapRoadmap>("/api/v1/coach/gap-roadmap", request)
        .toPromise();

      this.coachingTips.set(response || null);
    } catch (err: any) {
      this.error.set(
        err.error?.error?.message || "Failed to get coaching tips"
      );
    } finally {
      this.loadingCoaching.set(false);
    }
  }

  formatDocType(kind: string): string {
    switch (kind) {
      case "cv":
        return "CV / Resume";
      case "cover":
        return "Cover Letter";
      case "brochure":
        return "Company Brief";
      case "prep":
        return "Interview Prep";
      default:
        return kind;
    }
  }

  viewDocument(doc: GeneratedDoc) {
    // For V0, we'll just show the markdown content in a new window
    // In V1+, this will be more sophisticated
    window.open(doc.uri, "_blank");
  }

  viewApplicationTracker() {
    this.router.navigate(["/applications"]);
  }

  startOver() {
    this.jobText = "";
    this.jobUrl = "";
    this.jobDetail.set(null);
    this.generatedApplication.set(null);
    this.coachingTips.set(null);
    this.error.set(null);
    this.realityIndex = 1;
  }

  clearError() {
    this.error.set(null);
  }

  formatMatchScore(): string {
    const tips = this.coachingTips();
    if (!tips) return "0";
    return (tips.matchScore * 100).toFixed(0);
  }
}
