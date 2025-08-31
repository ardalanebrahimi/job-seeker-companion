import { PlannerAgent, PersonaDecision } from "./planner-agent";
import { WriterAgent, WriterResult } from "./writer-agent";
import { ReviewerAgent, ReviewResult } from "./reviewer-agent";
import { CoachAgent, CoachingResult } from "./coach-agent";
import { AgentContext, AgentResponse } from "./base-agent";

export interface V1GenerationRequest {
  jobId: string;
  realityIndex?: number;
  language?: string;
  personaHint?: string;
  stylePreference?: "concise" | "balanced" | "detailed";
}

export interface V1GenerationResult {
  applicationId: string;
  docs: Array<{
    kind: string;
    format: string;
    uri: string;
    variantLabel?: string;
    language?: string;
  }>;
  decision: {
    persona: string;
    realityIndex: number;
    signals: string[];
    keywordsEmphasized: string[];
    styleRationale: string;
    switches: Array<{ label: string; active: boolean }>;
    provenanceLinks: Array<{
      claimText: string;
      sourceFactId: string;
      factType: string;
    }>;
  };
}

/**
 * AgentOrchestrator - V1 Coordination Layer
 * Orchestrates all V1 agents to implement auto-decision flow
 * Implements the complete V1 epic workflow
 */
export class AgentOrchestrator {
  private plannerAgent: PlannerAgent;
  private writerAgent: WriterAgent;
  private reviewerAgent: ReviewerAgent;
  private coachAgent: CoachAgent;

  constructor() {
    this.plannerAgent = new PlannerAgent();
    this.writerAgent = new WriterAgent();
    this.reviewerAgent = new ReviewerAgent();
    this.coachAgent = new CoachAgent();
  }

  /**
   * Execute complete V1 auto-generation workflow
   * Implements all V1 user stories in sequence
   */
  async generateApplication(
    context: AgentContext,
    request: V1GenerationRequest
  ): Promise<AgentResponse<V1GenerationResult>> {
    try {
      console.log("[AgentOrchestrator] Starting V1 generation workflow");

      // Step 1: Auto-decide persona (User Story 1)
      const personaResult = await this.plannerAgent.decidePersona(context);
      if (!personaResult.success) {
        return {
          success: false,
          error: personaResult.error,
        };
      }
      const persona = request.personaHint || personaResult.data.persona;

      // Step 2: Auto-decide style and template (User Story 2)
      const styleResult = await this.plannerAgent.decideStyle(context, persona);
      if (!styleResult.success) {
        return {
          success: false,
          error: styleResult.error,
        };
      }
      const style = request.stylePreference || styleResult.data.style;

      // Step 3: Auto-decide Reality Index (User Story 3)
      const riResult = await this.plannerAgent.decideRealityIndex(context);
      if (!riResult.success) {
        return {
          success: false,
          error: riResult.error,
        };
      }
      const realityIndex =
        request.realityIndex !== undefined
          ? request.realityIndex
          : riResult.data.realityIndex;

      // Validate Reality Index (hard cap at 2)
      if (realityIndex > 2) {
        return {
          success: false,
          error: {
            code: "INVALID_REALITY_INDEX",
            message: "Reality Index cannot exceed 2",
          },
        };
      }

      // Step 4: Generate documents (Writer)
      const generationSettings = {
        persona,
        realityIndex,
        style,
        template: styleResult.data.template,
      };

      const writerResult = await this.writerAgent.generateDocuments(
        context,
        generationSettings
      );
      if (!writerResult.success) {
        return {
          success: false,
          error: writerResult.error,
        };
      }

      // Step 5: Review documents (User Story 6 - Writer + Reviewer Handshake)
      const reviewDocument = {
        content:
          writerResult.data.cvContent +
          "\n\n" +
          writerResult.data.coverLetterContent,
        realityIndex,
        provenanceLinks: writerResult.data.provenanceLinks,
      };

      const reviewResult = await this.reviewerAgent.reviewDocument(
        context,
        reviewDocument
      );
      if (!reviewResult.success) {
        return {
          success: false,
          error: reviewResult.error,
        };
      }

      // If review fails, attempt one automatic fix
      if (!reviewResult.data.passed) {
        console.log(
          "[AgentOrchestrator] Review failed, attempting automatic fix"
        );
        const fixedResult = await this.attemptAutoFix(
          context,
          generationSettings,
          reviewResult.data
        );
        if (fixedResult.success) {
          Object.assign(writerResult.data, fixedResult.data);
        } else {
          console.log(
            "[AgentOrchestrator] Auto-fix failed, proceeding with warnings"
          );
        }
      }

      // Step 6: Extract emphasized keywords from JD
      const keywordsEmphasized = this.extractEmphasizedKeywords(
        context.jobDetail,
        writerResult.data.cvContent
      );

      // Step 7: Create application record and store documents
      const applicationId = await this.createApplication(context, request);
      const docUris = await this.storeDocuments(
        applicationId,
        writerResult.data
      );

      // Step 8: Build final result with all V1 decision data
      const result: V1GenerationResult = {
        applicationId,
        docs: docUris,
        decision: {
          persona: personaResult.data.persona,
          realityIndex,
          signals: personaResult.data.signals,
          keywordsEmphasized,
          styleRationale: styleResult.data.rationale,
          switches: writerResult.data.switches,
          provenanceLinks: writerResult.data.provenanceLinks,
        },
      };

      console.log("[AgentOrchestrator] V1 generation completed successfully");
      return {
        success: true,
        data: result,
        metadata: {
          model: "agent-orchestration-v1",
          duration: Date.now(), // Should track actual duration
        },
      };
    } catch (error) {
      console.error("[AgentOrchestrator] Generation workflow failed:", error);
      return {
        success: false,
        error: {
          code: "WORKFLOW_FAILED",
          message: error.message,
        },
      };
    }
  }

  /**
   * Regenerate application with modified switches
   * Implements User Story 5 - Decision Explainability (switches)
   */
  async regenerateWithSwitches(
    context: AgentContext,
    applicationId: string,
    switches: Array<{ label: string; active: boolean }>,
    realityIndex?: number,
    stylePreference?: "concise" | "balanced" | "detailed"
  ): Promise<AgentResponse<V1GenerationResult>> {
    try {
      // Load existing application data
      const existingApp = await this.loadApplicationData(applicationId);
      if (!existingApp) {
        return {
          success: false,
          error: {
            code: "APPLICATION_NOT_FOUND",
            message: "Application not found",
          },
        };
      }

      // Use existing decisions but apply new switches/settings
      const settings = {
        persona: existingApp.decision.persona,
        realityIndex:
          realityIndex !== undefined
            ? realityIndex
            : existingApp.decision.realityIndex,
        style: stylePreference || existingApp.decision.style || "balanced",
        template: existingApp.decision.template || "modern-ats",
        switches,
      };

      // Regenerate with new settings
      const writerResult = await this.writerAgent.regenerateWithSwitches(
        context,
        settings
      );
      if (!writerResult.success) {
        return {
          success: false,
          error: writerResult.error,
        };
      }

      // Update stored documents
      const docUris = await this.storeDocuments(
        applicationId,
        writerResult.data
      );

      const result: V1GenerationResult = {
        applicationId,
        docs: docUris,
        decision: {
          ...existingApp.decision,
          realityIndex: settings.realityIndex,
          switches: writerResult.data.switches,
          provenanceLinks: writerResult.data.provenanceLinks,
        },
      };

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "REGENERATION_FAILED",
          message: error.message,
        },
      };
    }
  }

  /**
   * Get coaching nudges for an application
   * Implements User Story 7 - Coaching Nudges (Per-JD)
   */
  async getCoachingNudges(
    context: AgentContext,
    applicationId?: string
  ): Promise<AgentResponse<CoachingResult>> {
    try {
      let applicationData = null;
      if (applicationId) {
        applicationData = await this.loadApplicationData(applicationId);
      }

      return await this.coachAgent.generateNudges(context, applicationData);
    } catch (error) {
      return {
        success: false,
        error: {
          code: "COACHING_FAILED",
          message: error.message,
        },
      };
    }
  }

  /**
   * Attempt automatic fix based on review violations
   */
  private async attemptAutoFix(
    context: AgentContext,
    settings: any,
    reviewResult: ReviewResult
  ): Promise<AgentResponse<WriterResult>> {
    // For high-severity violations, try to automatically adjust
    const hasHighViolations = reviewResult.violations.some(
      (v) => v.severity === "high"
    );

    if (hasHighViolations) {
      // Reduce Reality Index and regenerate
      const fixedSettings = {
        ...settings,
        realityIndex: Math.max(0, settings.realityIndex - 1),
      };

      console.log(
        `[AgentOrchestrator] Attempting fix with RI=${fixedSettings.realityIndex}`
      );
      return await this.writerAgent.generateDocuments(context, fixedSettings);
    }

    return {
      success: false,
      error: {
        code: "AUTO_FIX_NOT_APPLICABLE",
        message: "No automatic fix available",
      },
    };
  }

  /**
   * Extract keywords that were emphasized in the generated content
   */
  private extractEmphasizedKeywords(
    jobDetail: any,
    cvContent: string
  ): string[] {
    const keywords = [];
    const jdStruct = jobDetail?.jdStruct || {};
    const requiredSkills = jdStruct.skills || [];

    // Check which JD keywords appear in the generated CV
    requiredSkills.forEach((skill) => {
      if (cvContent.toLowerCase().includes(skill.toLowerCase())) {
        keywords.push(skill);
      }
    });

    // Extract other emphasized terms
    const cvLower = cvContent.toLowerCase();
    const commonEmphasis = [
      "leadership",
      "stakeholder",
      "data-driven",
      "agile",
      "technical",
    ];

    commonEmphasis.forEach((term) => {
      if (cvLower.includes(term)) {
        keywords.push(term);
      }
    });

    return [...new Set(keywords)]; // Remove duplicates
  }

  /**
   * Create application record (mock implementation)
   */
  private async createApplication(
    context: AgentContext,
    request: V1GenerationRequest
  ): Promise<string> {
    // TODO: Implement actual database persistence
    // For now, return a mock UUID
    return `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Store generated documents (mock implementation)
   */
  private async storeDocuments(
    applicationId: string,
    writerResult: WriterResult
  ): Promise<
    Array<{
      kind: string;
      format: string;
      uri: string;
      variantLabel?: string;
      language?: string;
    }>
  > {
    // TODO: Implement actual document storage
    // For now, return mock URIs
    return [
      {
        kind: "cv",
        format: "md",
        uri: `blob://${applicationId}/cv.md`,
        variantLabel: "balanced",
        language: "en",
      },
      {
        kind: "cover",
        format: "md",
        uri: `blob://${applicationId}/cover.md`,
        variantLabel: "balanced",
        language: "en",
      },
    ];
  }

  /**
   * Load existing application data (mock implementation)
   */
  private async loadApplicationData(applicationId: string): Promise<any> {
    // TODO: Implement actual database lookup
    // For now, return mock data
    return {
      decision: {
        persona: "Technical-Product-Manager",
        realityIndex: 1,
        style: "balanced",
        template: "modern-ats",
      },
    };
  }
}
