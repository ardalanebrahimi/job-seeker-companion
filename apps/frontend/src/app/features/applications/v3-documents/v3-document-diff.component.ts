import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";

interface DiffChange {
  type: "added" | "removed" | "modified";
  section: string;
  originalText?: string;
  modifiedText?: string;
  reason: string;
  sourceFact: string;
}

interface DocumentDiff {
  documentId: string;
  changes: DiffChange[];
  summary: {
    addedCount: number;
    removedCount: number;
    modifiedCount: number;
    keyChanges: string[];
  };
}

@Component({
  selector: "app-v3-document-diff",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./v3-document-diff.component.html",
  styleUrls: ["./v3-document-diff.component.scss"],
})
export class V3DocumentDiffComponent implements OnInit {
  @Input() applicationId!: string;
  @Input() documentId!: string;

  loading = false;
  diff: DocumentDiff | null = null;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    // Get parameters from route if not provided via @Input
    if (!this.applicationId) {
      this.applicationId = this.route.snapshot.paramMap.get("id") || "";
    }
    if (!this.documentId) {
      this.documentId = this.route.snapshot.paramMap.get("documentId") || "";
    }

    this.loadDiff();
  }

  async loadDiff() {
    if (!this.applicationId || !this.documentId) {
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      const result = await this.http
        .get<DocumentDiff>(
          `/api/applications/${this.applicationId}/documents/${this.documentId}/diff`
        )
        .toPromise();
      this.diff = result || null;
    } catch (error) {
      console.error("Failed to load document diff:", error);
      this.error = "Failed to load document differences. Please try again.";
    } finally {
      this.loading = false;
    }
  }

  getChangeIcon(type: string): string {
    switch (type) {
      case "added":
        return "➕";
      case "removed":
        return "➖";
      case "modified":
        return "✏️";
      default:
        return "📝";
    }
  }

  getChangeClass(type: string): string {
    switch (type) {
      case "added":
        return "change-added";
      case "removed":
        return "change-removed";
      case "modified":
        return "change-modified";
      default:
        return "";
    }
  }

  trackByIndex(index: number): number {
    return index;
  }
}
