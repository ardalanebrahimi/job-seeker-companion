import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import {
  ApplicationsService,
  ApplicationList,
  ApplicationSummary,
  ApplicationStatus,
} from "../../../../../../packages/sdk";

@Component({
  selector: "app-applications-tracker-v2",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./applications-tracker-v2.component.html",
  styleUrls: ["./applications-tracker-v2.component.scss"],
})
export class ApplicationsTrackerV2Component implements OnInit {
  // Signals for reactive state management
  applications = signal<ApplicationSummary[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  // Filter and search state
  filters = signal({
    status: undefined as ApplicationStatus | undefined,
    company: "",
    search: "",
    sortBy: "createdAt" as "createdAt" | "appliedAt" | "status" | "company",
    sortOrder: "desc" as "asc" | "desc",
  });

  // Pagination state
  pagination = signal({
    page: 1,
    pageSize: 20,
    total: 0,
  });

  // Available filter options
  statusOptions = [
    { value: undefined, label: "All Statuses" },
    { value: ApplicationStatus.FOUND, label: "Found" },
    { value: ApplicationStatus.APPLIED, label: "Applied" },
    { value: ApplicationStatus.INTERVIEW, label: "Interview" },
    { value: ApplicationStatus.OFFER, label: "Offer" },
    { value: ApplicationStatus.REJECTED, label: "Rejected" },
  ];

  sortOptions = [
    { value: "createdAt", label: "Date Added" },
    { value: "appliedAt", label: "Date Applied" },
    { value: "status", label: "Status" },
    { value: "company", label: "Company" },
  ];

  ngOnInit() {
    this.loadApplications();
  }

  async loadApplications() {
    this.loading.set(true);
    this.error.set(null);

    try {
      const filters = this.filters();
      const pagination = this.pagination();

      const listParams: any = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        status: filters.status,
        ...(filters.company && { company: filters.company }),
        ...(filters.search && { search: filters.search }),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      };

      const result = await ApplicationsService.listApplications(listParams);

      this.applications.set(result.items);
      this.pagination.update((p) => ({
        ...p,
        total: result.total,
      }));
    } catch (error) {
      console.error("Failed to load applications:", error);
      this.error.set("Failed to load applications. Please try again.");
    } finally {
      this.loading.set(false);
    }
  }

  // Filter and search methods
  onStatusFilterChange(status: ApplicationStatus | undefined) {
    this.filters.update((f) => ({ ...f, status }));
    this.resetPagination();
    this.loadApplications();
  }

  onCompanyFilterChange(company: string) {
    this.filters.update((f) => ({ ...f, company }));
    this.resetPagination();
    this.loadApplications();
  }

  onSearchChange(search: string) {
    this.filters.update((f) => ({ ...f, search }));
    this.resetPagination();
    this.loadApplications();
  }

  onSortChange(sortBy: string, sortOrder: "asc" | "desc") {
    this.filters.update((f) => ({
      ...f,
      sortBy: sortBy as any,
      sortOrder,
    }));
    this.loadApplications();
  }

  // Pagination methods
  onPageChange(page: number) {
    this.pagination.update((p) => ({ ...p, page }));
    this.loadApplications();
  }

  onPageSizeChange(pageSize: number) {
    this.pagination.update((p) => ({ ...p, pageSize, page: 1 }));
    this.loadApplications();
  }

  private resetPagination() {
    this.pagination.update((p) => ({ ...p, page: 1 }));
  }

  // Utility methods
  getStatusColor(status: ApplicationStatus): string {
    switch (status) {
      case ApplicationStatus.FOUND:
        return "text-blue-600 bg-blue-100";
      case ApplicationStatus.APPLIED:
        return "text-yellow-600 bg-yellow-100";
      case ApplicationStatus.INTERVIEW:
        return "text-purple-600 bg-purple-100";
      case ApplicationStatus.OFFER:
        return "text-green-600 bg-green-100";
      case ApplicationStatus.REJECTED:
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  }

  getStatusIcon(status: ApplicationStatus): string {
    switch (status) {
      case ApplicationStatus.FOUND:
        return "🔍";
      case ApplicationStatus.APPLIED:
        return "📝";
      case ApplicationStatus.INTERVIEW:
        return "💬";
      case ApplicationStatus.OFFER:
        return "🎉";
      case ApplicationStatus.REJECTED:
        return "❌";
      default:
        return "❓";
    }
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  }

  // Helper methods for template
  getLocation(app: ApplicationSummary): string | null {
    return (app as any).location || null;
  }

  getHasNotes(app: ApplicationSummary): boolean {
    return (app as any).hasNotes || false;
  }

  // Export functionality
  async exportApplications() {
    try {
      const filters = this.filters();

      // TODO: Implement proper export when SDK is fixed
      console.log("Export functionality - filters:", filters);
      alert(
        "Export functionality will be implemented once the backend API is available."
      );

      // Placeholder CSV export using current data
      const applications = this.applications();
      if (applications.length === 0) {
        alert("No applications to export.");
        return;
      }

      // Create CSV content from current applications
      const headers = [
        "Company",
        "Title",
        "Status",
        "Date Added",
        "Date Applied",
        "Location",
        "Has Notes",
      ];
      const csvContent = [
        headers.join(","),
        ...applications.map((app) =>
          [
            app.company || "",
            app.title || "",
            app.status,
            this.formatDate(app.createdAt),
            this.formatDate(app.appliedAt || undefined),
            (app as any).location || "",
            (app as any).hasNotes ? "Yes" : "No",
          ].join(",")
        ),
      ].join("\n");

      // Download CSV file
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `applications-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export applications:", error);
    }
  }

  // Quick action methods
  async deleteApplication(id: string) {
    if (
      !confirm(
        "Are you sure you want to delete this application? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      // TODO: Implement proper delete when SDK is fixed
      console.log("Delete application:", id);
      alert(
        "Delete functionality will be implemented once the backend API is available."
      );

      // For now, just remove from local state as a placeholder
      this.applications.update((apps) => apps.filter((app) => app.id !== id));
      this.pagination.update((p) => ({ ...p, total: p.total - 1 }));
    } catch (error) {
      console.error("Failed to delete application:", error);
      alert("Failed to delete application. Please try again.");
    }
  }

  // Event handlers
  onFilterChange() {
    // Reset to first page when filters change
    this.pagination.update((p) => ({ ...p, page: 1 }));
    this.loadApplications();
  }

  goToPage(page: number) {
    this.pagination.update((p) => ({ ...p, page }));
    this.loadApplications();
  }

  trackByApplicationId(index: number, app: ApplicationSummary): string {
    return app.id;
  }

  // Calculate pagination info
  get paginationInfo() {
    const p = this.pagination();
    const totalPages = Math.ceil(p.total / p.pageSize);
    const start = (p.page - 1) * p.pageSize + 1;
    const end = Math.min(p.page * p.pageSize, p.total);

    // Generate page numbers for pagination controls
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, p.page - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return {
      start,
      end,
      totalPages,
      pages,
    };
  }
}
