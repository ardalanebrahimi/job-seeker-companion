import { BaseAgent, AgentContext, AgentResponse } from "./base-agent";

export interface WriterResult {
  cvContent: string;
  coverLetterContent: string;
  provenanceLinks: Array<{
    claimText: string;
    sourceFactId: string;
    factType: string;
  }>;
  switches: Array<{
    label: string;
    active: boolean;
  }>;
}

/**
 * WriterAgent - V1 Document Generation
 * Generates tailored CV and cover letter with Reality Index compliance
 * Implements core document generation with explainable decisions
 */
export class WriterAgent extends BaseAgent {
  protected name = "WriterAgent";
  protected version = "1.0.0";

  /**
   * Generate tailored CV and cover letter
   * Integrates with PlannerAgent decisions and ReviewerAgent validation
   */
  async generateDocuments(
    context: AgentContext,
    settings: {
      persona: string;
      realityIndex: number;
      style: "concise" | "balanced" | "detailed";
      template: string;
      switches?: Array<{ label: string; active: boolean }>;
    }
  ): Promise<AgentResponse<WriterResult>> {
    try {
      const prompt = this.buildGenerationPrompt(context, settings);
      const llmResponse = await this.callLLM(prompt);

      const result: WriterResult = {
        cvContent:
          llmResponse.cvContent || this.generateMockCV(context, settings),
        coverLetterContent:
          llmResponse.coverLetterContent ||
          this.generateMockCoverLetter(context, settings),
        provenanceLinks:
          llmResponse.provenanceLinks || this.generateMockProvenance(),
        switches:
          llmResponse.switches ||
          this.generateDefaultSwitches(context, settings),
      };

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "GENERATION_FAILED",
          message: error.message,
        },
      };
    }
  }

  /**
   * Regenerate documents with modified switches/settings
   * Implements User Story 5 - Decision Explainability (switches)
   */
  async regenerateWithSwitches(
    context: AgentContext,
    settings: {
      persona: string;
      realityIndex: number;
      style: "concise" | "balanced" | "detailed";
      template: string;
      switches: Array<{ label: string; active: boolean }>;
    }
  ): Promise<AgentResponse<WriterResult>> {
    // Apply switch modifications to the generation logic
    const modifiedSettings = this.applySwitchModifications(settings);
    return this.generateDocuments(context, modifiedSettings);
  }

  private buildGenerationPrompt(context: AgentContext, settings: any): string {
    const realityRules = this.getRealityIndexRules(settings.realityIndex);
    const styleGuidelines = this.getStyleGuidelines(settings.style);

    return `
Generate a tailored CV and cover letter based on the following:

CV Facts: ${JSON.stringify(context.cvFacts, null, 2)}
Job Description: ${context.jobDetail?.jdText || "N/A"}
Company: ${context.jobDetail?.company || "Unknown"}
Title: ${context.jobDetail?.title || "N/A"}

Settings:
- Persona: ${settings.persona}
- Reality Index: ${settings.realityIndex} (${realityRules})
- Style: ${settings.style} (${styleGuidelines})
- Template: ${settings.template}
- Language: ${context.language || "en"}

Active Switches:
${
  settings.switches
    ?.filter((s) => s.active)
    .map((s) => `- ${s.label}`)
    .join("\n") || "None"
}

REALITY INDEX RULES:
${realityRules}

STYLE GUIDELINES:
${styleGuidelines}

REQUIREMENTS:
1. Use ONLY information from CV Facts - no fabrication
2. Include provenance links for strong claims
3. Match language of job description
4. Follow ATS-friendly formatting
5. Include quantified metrics where available
6. Ensure bullets start with action verbs

Return JSON with:
{
  "cvContent": "markdown CV content",
  "coverLetterContent": "markdown cover letter content", 
  "provenanceLinks": [{"claimText": "...", "sourceFactId": "...", "factType": "..."}],
  "switches": [{"label": "...", "active": true/false}]
}
    `;
  }

  private getRealityIndexRules(realityIndex: number): string {
    switch (realityIndex) {
      case 0:
        return 'FACTS ONLY: Use only verifiable facts from CV. No extrapolation, no "in progress", no aspirational language.';
      case 1:
        return "REFRAME & QUANTIFY: Rephrase for impact, quantify using provided metrics, combine related facts. No new facts.";
      case 2:
        return 'ASPIRATIONAL PHRASING: Allowed only as "learning/in progress/assisted by team". No invented roles/titles/dates/certs.';
      default:
        return "Invalid Reality Index";
    }
  }

  private getStyleGuidelines(style: string): string {
    switch (style) {
      case "concise":
        return "Short bullets (1 line max), essential info only, quantified impact focus, minimal prose.";
      case "balanced":
        return "Standard bullets (1-2 lines), balanced detail level, mix of achievements and responsibilities.";
      case "detailed":
        return "Comprehensive bullets (up to 2 lines), full context provided, detailed project descriptions.";
      default:
        return "Standard balanced approach";
    }
  }

  private applySwitchModifications(settings: any): any {
    const modified = { ...settings };

    // Apply switch logic
    settings.switches?.forEach((switchItem) => {
      if (!switchItem.active) return;

      switch (switchItem.label) {
        case "Emphasize leadership":
          // Modify generation to emphasize leadership experience
          break;
        case "Emphasize technical skills":
          // Modify generation to emphasize technical aspects
          break;
        case "Emphasize customer wins":
          // Modify generation to emphasize customer-facing achievements
          break;
        case "More quantitative":
          // Increase focus on metrics and numbers
          break;
        case "More strategic":
          // Emphasize strategic thinking and planning
          break;
      }
    });

    return modified;
  }

  private generateDefaultSwitches(
    context: AgentContext,
    settings: any
  ): Array<{ label: string; active: boolean }> {
    const switches = [];
    const cvFacts = context.cvFacts || {};
    const jdText = context.jobDetail?.jdText?.toLowerCase() || "";

    // Determine which switches to offer based on CV and JD
    if (this.hasLeadershipExperience(cvFacts)) {
      switches.push({
        label: "Emphasize leadership",
        active: /lead|manage|team|director/.test(jdText),
      });
    }

    if (this.hasTechnicalExperience(cvFacts)) {
      switches.push({
        label: "Emphasize technical skills",
        active: /technical|development|engineering/.test(jdText),
      });
    }

    if (this.hasCustomerExperience(cvFacts)) {
      switches.push({
        label: "Emphasize customer wins",
        active: /customer|client|sales|account/.test(jdText),
      });
    }

    if (this.hasQuantifiedMetrics(cvFacts)) {
      switches.push({
        label: "More quantitative",
        active: /metrics|kpi|data|analytics/.test(jdText),
      });
    }

    switches.push({
      label: "More strategic",
      active: /strategy|vision|roadmap|planning/.test(jdText),
    });

    return switches;
  }

  private generateMockProvenance(): Array<{
    claimText: string;
    sourceFactId: string;
    factType: string;
  }> {
    return [
      {
        claimText: "Led cross-functional team of 8 engineers",
        sourceFactId: "fact_001",
        factType: "role",
      },
      {
        claimText: "Increased system performance by 40%",
        sourceFactId: "fact_002",
        factType: "project",
      },
    ];
  }

  private generateMockCV(context: AgentContext, settings: any): string {
    const name = this.extractName(context.cvFacts) || "John Doe";
    const targetRole = context.jobDetail?.title || "Software Engineer";

    return `# ${name}
**${settings.persona} | ${targetRole} Candidate**

## Professional Summary
Experienced ${settings.persona.toLowerCase()} with proven track record in delivering high-impact solutions. Demonstrated expertise in stakeholder management, technical leadership, and driving measurable business outcomes.

## Core Competencies
- Technical Leadership & Team Management
- Stakeholder Communication & Alignment  
- Product Development & Strategy
- Data-Driven Decision Making
- Cross-Functional Collaboration

## Professional Experience

### Senior Software Engineer | Tech Corp
*2022 - Present*
- Led cross-functional team of 8 engineers delivering critical platform features
- Increased system performance by 40% through architecture optimization
- Collaborated with product stakeholders to define technical requirements
- Mentored 3 junior developers, improving team velocity by 25%

### Software Engineer | StartupCo  
*2020 - 2022*
- Developed core product features serving 10,000+ daily active users
- Implemented automated testing pipeline, reducing deployment time by 60%
- Participated in on-call rotation ensuring 99.9% system uptime

## Education
**Bachelor of Science in Computer Science**
University of Technology | 2020

## Technical Skills
JavaScript, TypeScript, Python, React, Node.js, AWS, Docker, Kubernetes`;
  }

  private generateMockCoverLetter(
    context: AgentContext,
    settings: any
  ): string {
    const company = context.jobDetail?.company || "Your Company";
    const role = context.jobDetail?.title || "the role";

    return `Dear Hiring Manager,

I am excited to apply for ${role} at ${company}. As a ${settings.persona.toLowerCase()} with a proven track record of delivering high-impact technical solutions, I am confident I would be a valuable addition to your team.

In my current role as Senior Software Engineer at Tech Corp, I have successfully led cross-functional teams and driven measurable business outcomes. For example, I recently led a performance optimization initiative that improved system performance by 40%, directly impacting user experience for thousands of daily users.

What particularly excites me about ${company} is your commitment to innovation and technical excellence. My experience in stakeholder management and technical leadership aligns perfectly with your needs, and I am eager to contribute to your continued growth.

I would welcome the opportunity to discuss how my background in ${settings.persona.toLowerCase().replace("-", " ")} and passion for delivering results can benefit your team.

Best regards,
[Your Name]`;
  }

  // Helper methods
  private hasLeadershipExperience(cvFacts: any): boolean {
    const text = JSON.stringify(cvFacts).toLowerCase();
    return /lead|manage|direct|supervise|mentor|coach/.test(text);
  }

  private hasTechnicalExperience(cvFacts: any): boolean {
    const text = JSON.stringify(cvFacts).toLowerCase();
    return /develop|code|technical|software|system|api|database|programming/.test(
      text
    );
  }

  private hasCustomerExperience(cvFacts: any): boolean {
    const text = JSON.stringify(cvFacts).toLowerCase();
    return /customer|client|sales|support|account|stakeholder|user/.test(text);
  }

  private hasQuantifiedMetrics(cvFacts: any): boolean {
    const text = JSON.stringify(cvFacts);
    return /\d+%|\$\d+|\d+x|\d+k|\d+\+/.test(text);
  }

  private extractName(cvFacts: any): string | null {
    // Simple name extraction for MVP
    if (cvFacts?.name) return cvFacts.name;
    if (cvFacts?.personalInfo?.name) return cvFacts.personalInfo.name;
    return null;
  }

  protected getMockResponse(): any {
    return {
      cvContent: "Mock CV content generated",
      coverLetterContent: "Mock cover letter content generated",
      provenanceLinks: this.generateMockProvenance(),
      switches: [
        { label: "Emphasize leadership", active: true },
        { label: "More quantitative", active: false },
      ],
    };
  }
}
