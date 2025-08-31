import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import {
  ApplicationsService,
  CoachService,
  JobsService,
  ApplicationGenerateRequest,
} from "@job-companion/sdk";
import type {
  ApplicationGenerateResponse,
  CoachingNudges,
  JobDetail,
} from "@job-companion/sdk";

@Component({
  selector: "app-v1-generator",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./v1-generator.component.html",
  styleUrls: ["./v1-generator.component.scss"],
})
export class V1GeneratorComponent implements OnInit {
  jobUrl = "";
  jobId = "";
  jobDetail: JobDetail | null = null;

  // V1 Features
  realityIndex = 1;
  personaHint = "";
  stylePreference: ApplicationGenerateRequest.stylePreference =
    ApplicationGenerateRequest.stylePreference.BALANCED;

  // Generation state
  isGenerating = false;
  generationResult: ApplicationGenerateResponse | null = null;
  coachingNudges: CoachingNudges | null = null;

  // Error handling
  error = "";

  constructor(private router: Router) {}

  ngOnInit() {
    // Component initialization
  }

  async ingestJob() {
    if (!this.jobUrl.trim()) {
      this.error = "Please enter a job URL";
      return;
    }

    try {
      this.error = "";
      const ingestResult = await JobsService.ingestJob({
        requestBody: {
          url: this.jobUrl,
        },
      });

      this.jobId = ingestResult.jobId;

      // Get job details
      this.jobDetail = await JobsService.getJob({
        id: this.jobId,
      });
    } catch (error: any) {
      this.error = `Failed to ingest job: ${error.message}`;
    }
  }

  async generateApplication() {
    if (!this.jobId) {
      this.error = "Please ingest a job first";
      return;
    }

    try {
      this.isGenerating = true;
      this.error = "";

      const request: ApplicationGenerateRequest = {
        jobId: this.jobId,
        realityIndex: this.realityIndex,
        personaHint: this.personaHint || undefined,
        stylePreference: this.stylePreference,
      };

      // Generate application using V1 agents
      this.generationResult =
        await ApplicationsService.generateApplicationDocuments({
          requestBody: request,
        });

      // Get coaching nudges
      await this.getCoachingNudges();
    } catch (error: any) {
      this.error = `Generation failed: ${error.message}`;
    } finally {
      this.isGenerating = false;
    }
  }

  async getCoachingNudges() {
    if (!this.jobId) return;

    try {
      this.coachingNudges = await CoachService.getCoachingNudges({
        requestBody: {
          jobId: this.jobId,
          applicationId: this.generationResult?.applicationId,
        },
      });
    } catch (error: any) {
      console.warn("Failed to get coaching nudges:", error.message);
    }
  }

  async regenerateWithSwitches() {
    if (!this.generationResult?.applicationId) return;

    try {
      this.isGenerating = true;
      this.error = "";

      // Prepare switches from current decision
      const switches =
        this.generationResult.decision?.switches?.map((sw) => ({
          label: sw.label,
          active: sw.active,
        })) || [];

      const regenerateResult =
        await ApplicationsService.regenerateApplicationDocuments({
          id: this.generationResult.applicationId,
          requestBody: {
            switches,
            realityIndex: this.realityIndex,
            stylePreference: this.stylePreference,
          },
        });

      this.generationResult = regenerateResult;
      await this.getCoachingNudges();
    } catch (error: any) {
      this.error = `Regeneration failed: ${error.message}`;
    } finally {
      this.isGenerating = false;
    }
  }

  toggleSwitch(switchIndex: number) {
    if (this.generationResult?.decision?.switches?.[switchIndex]) {
      this.generationResult.decision.switches[switchIndex].active =
        !this.generationResult.decision.switches[switchIndex].active;
    }
  }

  getRealityIndexDescription(index: number): string {
    switch (index) {
      case 0:
        return "Facts Only - Only verifiable facts from CV";
      case 1:
        return "Reframe & Quantify - Rephrase for impact with evidence";
      case 2:
        return 'Aspirational - "Learning/in progress" phrasing allowed';
      default:
        return "Unknown";
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case "high":
        return "priority-high";
      case "medium":
        return "priority-medium";
      case "low":
        return "priority-low";
      default:
        return "";
    }
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case "emphasize":
        return "✨";
      case "trim":
        return "✂️";
      case "gap":
        return "🎯";
      case "improvement":
        return "📈";
      default:
        return "💡";
    }
  }
}
