import { BaseAgent, AgentContext, AgentResponse } from "./base-agent";

export interface PersonaDecision {
  persona: string;
  confidence: number;
  signals: string[];
  rationale: string;
}

/**
 * PlannerAgent - V1 Auto-Decider
 * Automatically decides persona, style, template, and Reality Index
 * Implements User Stories 1, 2, and parts of 5 from V1
 */
export class PlannerAgent extends BaseAgent {
  protected name = "PlannerAgent";
  protected version = "1.0.0";

  /**
   * Auto-decide persona based on CV facts and JD analysis
   * Implements User Story 1 - Auto Persona (No Fixed Roles)
   */
  async decidePersona(
    context: AgentContext
  ): Promise<AgentResponse<PersonaDecision>> {
    try {
      const prompt = this.buildPersonaPrompt(context);
      const llmResponse = await this.callLLM(prompt);

      const decision: PersonaDecision = {
        persona: llmResponse.persona || this.fallbackPersona(context),
        confidence: llmResponse.confidence || 0.6,
        signals: llmResponse.signals || this.extractSignals(context),
        rationale:
          llmResponse.rationale || "Auto-decided based on available signals",
      };

      this.logDecision(context, decision);

      return {
        success: true,
        data: decision,
        metadata: {
          model: "gpt-4",
          duration: 1200,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "PERSONA_DECISION_FAILED",
          message: error.message,
        },
      };
    }
  }

  /**
   * Auto-decide style and template
   * Implements User Story 2 - Auto Style & Template Choice
   */
  async decideStyle(
    context: AgentContext,
    persona: string
  ): Promise<
    AgentResponse<{
      style: "concise" | "balanced" | "detailed";
      template: string;
      rationale: string;
    }>
  > {
    try {
      const prompt = this.buildStylePrompt(context, persona);
      const llmResponse = await this.callLLM(prompt);

      const decision = {
        style: llmResponse.style || "balanced",
        template: llmResponse.template || "modern-ats",
        rationale: llmResponse.rationale || "Standard ATS-friendly format",
      };

      return {
        success: true,
        data: decision,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "STYLE_DECISION_FAILED",
          message: error.message,
        },
      };
    }
  }

  /**
   * Auto-decide Reality Index based on CV quality and JD requirements
   * Implements User Story 3 - Reality Index Dial (0–2)
   */
  async decideRealityIndex(context: AgentContext): Promise<
    AgentResponse<{
      realityIndex: number;
      rationale: string;
    }>
  > {
    try {
      const prompt = this.buildRealityIndexPrompt(context);
      const llmResponse = await this.callLLM(prompt);

      let realityIndex = llmResponse.realityIndex || 1;

      // Hard cap at 2 as per V1 requirements
      if (realityIndex > 2) {
        realityIndex = 2;
      }

      const decision = {
        realityIndex,
        rationale: llmResponse.rationale || "Standard reframing and emphasis",
      };

      return {
        success: true,
        data: decision,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "REALITY_INDEX_DECISION_FAILED",
          message: error.message,
        },
      };
    }
  }

  private buildPersonaPrompt(context: AgentContext): string {
    return `
Analyze the following CV facts and job description to determine the best-fit persona.

CV Facts: ${JSON.stringify(context.cvFacts, null, 2)}
Job Description: ${context.jobDetail?.jdText || "N/A"}

Rules:
1. Infer latent persona from user's actual history (e.g., "Product-leaning", "Customer-Success-leaning", "Data-curious PM")
2. NEVER add roles or titles not present in user history
3. If signals are weak/ambiguous, use "Generalist" persona
4. Provide top 3 signals that support your choice

Return JSON with: persona, confidence (0-1), signals (array), rationale
    `;
  }

  private buildStylePrompt(context: AgentContext, persona: string): string {
    return `
Based on the job description and persona "${persona}", decide the optimal document style.

Job Description: ${context.jobDetail?.jdText || "N/A"}
Company: ${context.jobDetail?.company || "Unknown"}

Rules:
1. Default tone: concise, impact-first, ATS-friendly
2. Enterprise JD → quantitative bullets + concise summary
3. Startup JD → more personality + growth metrics
4. Language matches JD language: ${context.language || "en"}

Return JSON with: style (concise/balanced/detailed), template, rationale
    `;
  }

  private buildRealityIndexPrompt(context: AgentContext): string {
    return `
Analyze CV completeness and JD requirements to suggest Reality Index (0-2).

CV Facts Quality: ${this.assessCVQuality(context.cvFacts)}
JD Competitiveness: ${this.assessJDCompetitiveness(context.jobDetail)}

Reality Index Levels:
- 0: Facts-only, no extrapolation
- 1: Reframe & quantify with evidence (DEFAULT)
- 2: Aspirational phrasing ("learning", "in progress", "assisted by team")

Return JSON with: realityIndex (0-2), rationale
    `;
  }

  private fallbackPersona(context: AgentContext): string {
    // Simple heuristic for fallback
    const cvFacts = context.cvFacts || {};
    const hasLeadershipExperience = this.hasLeadershipSignals(cvFacts);
    const hasTechnicalSkills = this.hasTechnicalSignals(cvFacts);

    if (hasLeadershipExperience && hasTechnicalSkills) {
      return "Technical-Leader";
    } else if (hasLeadershipExperience) {
      return "Leadership-Oriented";
    } else if (hasTechnicalSkills) {
      return "Technical-Specialist";
    }

    return "Generalist";
  }

  private extractSignals(context: AgentContext): string[] {
    const signals = [];
    const cvFacts = context.cvFacts || {};

    if (this.hasLeadershipSignals(cvFacts)) {
      signals.push("Leadership experience detected");
    }
    if (this.hasTechnicalSignals(cvFacts)) {
      signals.push("Technical skills present");
    }
    if (this.hasCustomerFacingExperience(cvFacts)) {
      signals.push("Customer-facing roles");
    }

    return signals.length > 0 ? signals : ["Limited signals available"];
  }

  private hasLeadershipSignals(cvFacts: any): boolean {
    // Simple keyword detection for MVP
    const text = JSON.stringify(cvFacts).toLowerCase();
    return /lead|manage|direct|supervise|team|coordinate/.test(text);
  }

  private hasTechnicalSignals(cvFacts: any): boolean {
    const text = JSON.stringify(cvFacts).toLowerCase();
    return /develop|code|technical|software|system|api|database/.test(text);
  }

  private hasCustomerFacingExperience(cvFacts: any): boolean {
    const text = JSON.stringify(cvFacts).toLowerCase();
    return /customer|client|sales|support|account|stakeholder/.test(text);
  }

  private assessCVQuality(cvFacts: any): string {
    if (!cvFacts) return "poor";

    const experienceCount = cvFacts.experience?.length || 0;
    const hasQuantifiedMetrics =
      JSON.stringify(cvFacts).includes("%") ||
      JSON.stringify(cvFacts).includes("$") ||
      /\d+/.test(JSON.stringify(cvFacts));

    if (experienceCount >= 3 && hasQuantifiedMetrics) return "high";
    if (experienceCount >= 2) return "medium";
    return "low";
  }

  private assessJDCompetitiveness(jobDetail: any): string {
    if (!jobDetail) return "medium";

    const jdText = jobDetail.jdText || "";
    const hasHighRequirements = /senior|lead|director|manager|expert/.test(
      jdText.toLowerCase()
    );
    const hasSpecificSkills =
      (jdText.match(/required|must have/gi) || []).length > 3;

    if (hasHighRequirements && hasSpecificSkills) return "high";
    if (hasHighRequirements || hasSpecificSkills) return "medium";
    return "low";
  }

  protected getMockResponse(): any {
    return {
      persona: "Technical-Product-Manager",
      confidence: 0.8,
      signals: [
        "Recent PM roles",
        "Technical background",
        "Stakeholder management",
      ],
      rationale:
        "Strong match for technical product roles based on recent experience",
      style: "balanced",
      template: "modern-ats",
      realityIndex: 1,
    };
  }
}
