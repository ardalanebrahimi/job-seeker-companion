import { Component, inject, signal, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

interface ApplicationSummary {
  id: string;
  company?: string;
  title?: string;
  status: "Found" | "Applied" | "Interview" | "Offer" | "Rejected";
  createdAt: string;
  appliedAt?: string;
}

interface ApplicationList {
  items: ApplicationSummary[];
  page: number;
  pageSize: number;
  total: number;
}

@Component({
  selector: "app-applications-tracker",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tracker-page">
      <div class="header">
        <h2>Application Tracker</h2>
        <button
          type="button"
          class="btn btn-primary"
          (click)="router.navigate(['/generate'])"
        >
          + New Application
        </button>
      </div>

      <!-- Status Filter -->
      <div class="filters">
        <button
          type="button"
          class="filter-btn"
          [class.active]="selectedStatus() === null"
          (click)="filterByStatus(null)"
        >
          All ({{ total() }})
        </button>
        <button
          type="button"
          class="filter-btn"
          [class.active]="selectedStatus() === 'Found'"
          (click)="filterByStatus('Found')"
        >
          Found
        </button>
        <button
          type="button"
          class="filter-btn"
          [class.active]="selectedStatus() === 'Applied'"
          (click)="filterByStatus('Applied')"
        >
          Applied
        </button>
        <button
          type="button"
          class="filter-btn"
          [class.active]="selectedStatus() === 'Interview'"
          (click)="filterByStatus('Interview')"
        >
          Interview
        </button>
        <button
          type="button"
          class="filter-btn"
          [class.active]="selectedStatus() === 'Offer'"
          (click)="filterByStatus('Offer')"
        >
          Offer
        </button>
        <button
          type="button"
          class="filter-btn"
          [class.active]="selectedStatus() === 'Rejected'"
          (click)="filterByStatus('Rejected')"
        >
          Rejected
        </button>
      </div>

      <!-- Loading State -->
      <div class="loading" *ngIf="loading()">
        <div class="spinner"></div>
        <p>Loading applications...</p>
      </div>

      <!-- Empty State -->
      <div
        class="empty-state"
        *ngIf="!loading() && applications().length === 0"
      >
        <h3>No Applications Yet</h3>
        <p>Start by generating your first tailored application</p>
        <button
          type="button"
          class="btn btn-primary"
          (click)="router.navigate(['/generate'])"
        >
          Generate Application
        </button>
      </div>

      <!-- Applications List -->
      <div
        class="applications-list"
        *ngIf="!loading() && applications().length > 0"
      >
        <div
          class="application-card"
          *ngFor="let app of applications()"
          (click)="viewApplication(app.id)"
        >
          <div class="app-header">
            <h4>{{ app.title || "Position" }}</h4>
            <span
              class="status-badge"
              [class]="'status-' + app.status.toLowerCase()"
            >
              {{ app.status }}
            </span>
          </div>

          <div class="app-details">
            <p class="company" *ngIf="app.company">{{ app.company }}</p>
            <p class="dates">
              <span>Created: {{ formatDate(app.createdAt) }}</span>
              <span *ngIf="app.appliedAt">
                • Applied: {{ formatDate(app.appliedAt) }}</span
              >
            </p>
          </div>
        </div>
      </div>

      <!-- Error Display -->
      <div class="error" *ngIf="error()">
        <p>{{ error() }}</p>
        <button
          type="button"
          class="btn btn-outline"
          (click)="loadApplications()"
        >
          Retry
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .tracker-page {
        max-width: 900px;
        margin: 0 auto;
        padding: 20px;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
      }

      .header h2 {
        margin: 0;
      }

      .filters {
        display: flex;
        gap: 10px;
        margin-bottom: 30px;
        flex-wrap: wrap;
      }

      .filter-btn {
        background: #f8f9fa;
        border: 1px solid #ddd;
        padding: 8px 16px;
        border-radius: 20px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s;
      }

      .filter-btn:hover {
        background: #e9ecef;
      }

      .filter-btn.active {
        background: #007bff;
        color: white;
        border-color: #007bff;
      }

      .btn {
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        text-decoration: none;
        display: inline-block;
      }

      .btn-primary {
        background-color: #007bff;
        color: white;
      }

      .btn-outline {
        background-color: transparent;
        color: #007bff;
        border: 1px solid #007bff;
      }

      .btn:hover:not(:disabled) {
        opacity: 0.9;
        transform: translateY(-1px);
      }

      .loading {
        text-align: center;
        padding: 60px;
      }

      .spinner {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #007bff;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 2s linear infinite;
        margin: 0 auto 20px;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      .empty-state {
        text-align: center;
        padding: 60px;
        color: #666;
      }

      .empty-state h3 {
        margin-bottom: 10px;
      }

      .applications-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .application-card {
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 20px;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .application-card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateY(-2px);
      }

      .app-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }

      .app-header h4 {
        margin: 0;
        color: #333;
      }

      .status-badge {
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;
      }

      .status-found {
        background-color: #e3f2fd;
        color: #1976d2;
      }

      .status-applied {
        background-color: #fff3e0;
        color: #f57c00;
      }

      .status-interview {
        background-color: #f3e5f5;
        color: #7b1fa2;
      }

      .status-offer {
        background-color: #e8f5e8;
        color: #2e7d32;
      }

      .status-rejected {
        background-color: #ffebee;
        color: #c62828;
      }

      .app-details {
        color: #666;
      }

      .company {
        font-weight: 500;
        margin: 0 0 5px 0;
      }

      .dates {
        font-size: 14px;
        margin: 0;
      }

      .error {
        text-align: center;
        padding: 40px;
        color: #dc3545;
      }
    `,
  ],
})
export class ApplicationsTrackerComponent implements OnInit {
  private http = inject(HttpClient);
  router = inject(Router);

  applications = signal<ApplicationSummary[]>([]);
  selectedStatus = signal<string | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  total = signal(0);

  ngOnInit() {
    this.loadApplications();
  }

  async loadApplications() {
    this.loading.set(true);
    this.error.set(null);

    try {
      const params = new URLSearchParams();
      if (this.selectedStatus()) {
        params.append("status", this.selectedStatus()!);
      }

      const response = await this.http
        .get<ApplicationList>(`/api/v1/applications?${params.toString()}`)
        .toPromise();

      if (response) {
        this.applications.set(response.items);
        this.total.set(response.total);
      }
    } catch (err: any) {
      this.error.set(
        err.error?.error?.message || "Failed to load applications"
      );
    } finally {
      this.loading.set(false);
    }
  }

  filterByStatus(status: string | null) {
    this.selectedStatus.set(status);
    this.loadApplications();
  }

  viewApplication(id: string) {
    this.router.navigate(["/applications", id]);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
}
