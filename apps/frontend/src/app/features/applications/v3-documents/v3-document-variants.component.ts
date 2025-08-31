import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";

// Define interfaces locally for now
interface VariantGenerateRequest {
  variants: Array<'concise' | 'balanced' | 'detailed'>;
  regenerateExisting?: boolean;
  targetFormat?: 'docx' | 'pdf';
}

interface DocumentVariant {
  variantLabel: string;
  documents: Array<{
    id: string;
    kind: string;
    format: string;
    previewUrl: string;
    downloadUrl: string;
    templateStyle: string;
  }>;
  coachingNote: string;
}

interface VariantGenerateResponse {
  variants: DocumentVariant[];
  recommendedVariant?: string;
}

@Component({
  selector: "app-v3-document-variants",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./v3-document-variants.component.html",
  styleUrls: ["./v3-document-variants.component.scss"],
})
export class V3DocumentVariantsComponent implements OnInit {
  @Input() applicationId!: string;

  loading = false;
  variants: DocumentVariant[] = [];
  recommendedVariant = "";
  selectedVariants: string[] = ["concise", "detailed"];
  targetFormat: "docx" | "pdf" = "docx";

  variantOptions = [
    {
      value: "concise",
      label: "Concise",
      description: "Focused on most relevant experience",
    },
    {
      value: "balanced",
      label: "Balanced",
      description: "Comprehensive but selective",
    },
    {
      value: "detailed",
      label: "Detailed",
      description: "Shows full career progression",
    },
  ];

  formatOptions = [
    { value: "docx" as const, label: "DOCX (Word)" },
    { value: "pdf" as const, label: "PDF" },
  ];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // Get applicationId from route params if not provided via @Input
    if (!this.applicationId) {
      this.applicationId = this.route.snapshot.paramMap.get('id') || '';
    }
    
    // Auto-generate default variants on load
    if (this.applicationId) {
      this.generateVariants();
    }
  }

  async generateVariants() {
    if (!this.applicationId || this.selectedVariants.length === 0) {
      return;
    }

    this.loading = true;

    try {
      const request: VariantGenerateRequest = {
        variants: this.selectedVariants as Array<'concise' | 'balanced' | 'detailed'>,
        targetFormat: this.targetFormat,
      };

      const result = await this.http
        .post<VariantGenerateResponse>(
          `/api/applications/${this.applicationId}/variants`,
          request
        )
        .toPromise();

      if (result) {
        this.variants = result.variants;
        this.recommendedVariant = result.recommendedVariant || "";
      }
    } catch (error) {
      console.error("Failed to generate variants:", error);
      // TODO: Show error message to user
    } finally {
      this.loading = false;
    }
  }

  onVariantSelectionChange(variant: string, checked: boolean) {
    if (checked) {
      this.selectedVariants.push(variant);
    } else {
      this.selectedVariants = this.selectedVariants.filter(
        (v) => v !== variant
      );
    }
  }

  onCheckboxChange(event: Event, variant: string) {
    const target = event.target as HTMLInputElement;
    this.onVariantSelectionChange(variant, target.checked);
  }

  isVariantSelected(variant: string): boolean {
    return this.selectedVariants.includes(variant);
  }

  async previewDocument(applicationId: string, documentId: string) {
    try {
      const html = await this.http
        .get(
          `/api/applications/${applicationId}/documents/${documentId}/preview`,
          { responseType: "text" }
        )
        .toPromise();

      // Open preview in new window
      const previewWindow = window.open("", "_blank");
      if (previewWindow && html) {
        previewWindow.document.write(html);
        previewWindow.document.close();
      }
    } catch (error) {
      console.error("Failed to preview document:", error);
    }
  }

  async downloadDocument(applicationId: string, documentId: string) {
    try {
      const blob = await this.http
        .get(
          `/api/applications/${applicationId}/documents/${documentId}/download`,
          { responseType: "blob" }
        )
        .toPromise();
      
      if (blob) {
        // Create download URL and trigger download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `document-${documentId}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Failed to download document:", error);
    }
  }

  async viewDiff(applicationId: string, documentId: string) {
    try {
      const diff = await this.http
        .get<any>(
          `/api/applications/${applicationId}/documents/${documentId}/diff`
        )
        .toPromise();

      // TODO: Show diff in a modal or navigate to diff view
      console.log("Document diff:", diff);
    } catch (error) {
      console.error("Failed to get document diff:", error);
    }
  }

  getVariantIcon(variantLabel: string): string {
    switch (variantLabel) {
      case "concise":
        return "📄";
      case "balanced":
        return "📋";
      case "detailed":
        return "📑";
      default:
        return "📄";
    }
  }

  getDocumentIcon(kind: string): string {
    switch (kind) {
      case "cv":
        return "📄";
      case "cover":
        return "✉️";
      default:
        return "📄";
    }
  }
}
