import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";

interface CvPreview {
  summary?: string;
  skills?: string[];
  experience?: Array<{
    company?: string;
    title?: string;
    startDate?: string;
    endDate?: string;
    bullets?: string[];
  }>;
  education?: Array<{
    institution?: string;
    degree?: string;
    year?: string;
  }>;
  fileUri?: string;
}

interface CvUploadResponse {
  fileId: string;
  parsed: boolean;
  language?: string;
  preview?: CvPreview;
}

@Component({
  selector: "app-cv-page",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="cv-page">
      <h2>CV Management</h2>

      <!-- Upload Section -->
      <div class="card">
        <h3>Upload Your CV</h3>
        <form (ngSubmit)="uploadCv()" #uploadForm="ngForm">
          <div class="form-group">
            <label for="cvFile">Select CV file (PDF or DOCX)</label>
            <input
              type="file"
              id="cvFile"
              class="form-control"
              accept=".pdf,.docx"
              (change)="onFileSelected($event)"
              required
            />
          </div>

          <div class="form-group">
            <label for="language">Language (optional)</label>
            <select
              id="language"
              class="form-control"
              [(ngModel)]="language"
              name="language"
            >
              <option value="">Auto-detect</option>
              <option value="en">English</option>
              <option value="de">German</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
            </select>
          </div>

          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="!selectedFile || uploading"
          >
            {{ uploading ? "Uploading..." : "Upload CV" }}
          </button>
        </form>

        <div *ngIf="uploadError" class="error">
          {{ uploadError }}
        </div>

        <div *ngIf="uploadSuccess" class="success">
          CV uploaded successfully! {{ uploadSuccess }}
        </div>
      </div>

      <!-- Preview Section -->
      <div *ngIf="cvPreview" class="card">
        <h3>CV Preview</h3>

        <div *ngIf="cvPreview.summary" class="preview-section">
          <h4>Summary</h4>
          <p>{{ cvPreview.summary }}</p>
        </div>

        <div
          *ngIf="cvPreview.skills && cvPreview.skills.length > 0"
          class="preview-section"
        >
          <h4>Skills</h4>
          <div class="skills-container">
            <span *ngFor="let skill of cvPreview.skills" class="chip">{{
              skill
            }}</span>
          </div>
        </div>

        <div
          *ngIf="cvPreview.experience && cvPreview.experience.length > 0"
          class="preview-section"
        >
          <h4>Experience</h4>
          <div
            *ngFor="let exp of cvPreview.experience.slice(0, 3)"
            class="experience-item"
          >
            <h5 *ngIf="exp.company || exp.title">
              {{ exp.title || "Position" }}
              <span *ngIf="exp.company"> at {{ exp.company }}</span>
            </h5>
            <ul *ngIf="exp.bullets && exp.bullets.length > 0">
              <li *ngFor="let bullet of exp.bullets.slice(0, 3)">
                {{ bullet }}
              </li>
            </ul>
          </div>
        </div>

        <div
          *ngIf="cvPreview.education && cvPreview.education.length > 0"
          class="preview-section"
        >
          <h4>Education</h4>
          <div *ngFor="let edu of cvPreview.education" class="education-item">
            <p>
              <strong>{{ edu.degree || "Degree" }}</strong>
              <span *ngIf="edu.institution"> - {{ edu.institution }}</span>
              <span *ngIf="edu.year"> ({{ edu.year }})</span>
            </p>
          </div>
        </div>
      </div>

      <div *ngIf="loading" class="card">
        <p>Loading CV preview...</p>
      </div>
    </div>
  `,
  styles: [
    `
      .cv-page {
        max-width: 800px;
        margin: 0 auto;
      }

      .preview-section {
        margin-bottom: 2rem;
      }

      .preview-section h4 {
        color: #343a40;
        margin-bottom: 1rem;
        border-bottom: 2px solid #e9ecef;
        padding-bottom: 0.5rem;
      }

      .skills-container {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .experience-item {
        margin-bottom: 1.5rem;
        padding: 1rem;
        background-color: #f8f9fa;
        border-radius: 4px;
      }

      .experience-item h5 {
        margin: 0 0 0.5rem 0;
        color: #495057;
      }

      .experience-item ul {
        margin: 0;
        padding-left: 1.5rem;
      }

      .experience-item li {
        margin-bottom: 0.25rem;
      }

      .education-item {
        margin-bottom: 1rem;
      }

      .error {
        margin-top: 1rem;
      }

      .success {
        margin-top: 1rem;
      }
    `,
  ],
})
export class CvPageComponent {
  private http = inject(HttpClient);

  selectedFile: File | null = null;
  language = "";
  uploading = false;
  loading = false;
  uploadError = "";
  uploadSuccess = "";
  cvPreview: CvPreview | null = null;

  ngOnInit() {
    this.loadCvPreview();
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      this.selectedFile = target.files[0];
      this.uploadError = "";
    }
  }

  async uploadCv() {
    if (!this.selectedFile) return;

    this.uploading = true;
    this.uploadError = "";
    this.uploadSuccess = "";

    const formData = new FormData();
    formData.append("file", this.selectedFile);
    if (this.language) {
      formData.append("language", this.language);
    }

    try {
      const response = await this.http
        .post<CvUploadResponse>("/api/v1/users/me/cv", formData)
        .toPromise();

      if (response) {
        this.uploadSuccess = response.parsed
          ? "CV uploaded and parsed successfully!"
          : "CV uploaded but could not be parsed. File has been saved.";

        if (response.preview) {
          this.cvPreview = response.preview;
        } else {
          // Load the preview after upload
          setTimeout(() => this.loadCvPreview(), 1000);
        }

        // Reset form
        this.selectedFile = null;
        this.language = "";
        const fileInput = document.getElementById("cvFile") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      }
    } catch (error: any) {
      this.uploadError =
        error.error?.error?.message || "Failed to upload CV. Please try again.";
      console.error("Upload error:", error);
    } finally {
      this.uploading = false;
    }
  }

  async loadCvPreview() {
    this.loading = true;
    try {
      const preview = await this.http
        .get<CvPreview>("/api/v1/users/me/cv")
        .toPromise();
      this.cvPreview = preview || null;
    } catch (error: any) {
      if (error.status !== 404) {
        console.error("Failed to load CV preview:", error);
      }
      // Don't show error for 404 - just means no CV uploaded yet
      this.cvPreview = null;
    } finally {
      this.loading = false;
    }
  }
}
