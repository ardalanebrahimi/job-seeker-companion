import { BaseAgent, AgentContext, AgentResponse } from "./base-agent";

export interface CoachingNudge {
  category: "emphasize" | "trim" | "gap" | "improvement";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

export interface ImmediateAction {
  action: string;
  etaDays: number;
}

export interface CoachingResult {
  nudges: CoachingNudge[];
  immediateActions: ImmediateAction[];
  jdThemes: string[];
}

/**
 * CoachAgent - V1 Actionable Coaching
 * Provides per-JD coaching nudges and immediate actions
 * Implements User Story 7 - Coaching Nudges (Per-JD)
 */
export class CoachAgent extends BaseAgent {
  protected name = "CoachAgent";
  protected version = "1.0.0";

  /**
   * Generate coaching nudges for a specific job application
   * Implements User Story 7 - Coaching Nudges (Per-JD)
   */
  async generateNudges(
    context: AgentContext,
    applicationData?: {
      decision?: any;
      documents?: any[];
    }
  ): Promise<AgentResponse<CoachingResult>> {
    try {
      const jdThemes = this.extractJDThemes(context.jobDetail);
      const cvGaps = this.identifyGaps(context.cvFacts, context.jobDetail);
      const strengthsToEmphasize = this.identifyStrengths(
        context.cvFacts,
        context.jobDetail
      );

      const nudges: CoachingNudge[] = [];
      const immediateActions: ImmediateAction[] = [];

      // Generate emphasis nudges
      nudges.push(
        ...this.generateEmphasisNudges(strengthsToEmphasize, jdThemes)
      );

      // Generate gap nudges
      nudges.push(...this.generateGapNudges(cvGaps, jdThemes));

      // Generate improvement nudges
      nudges.push(...this.generateImprovementNudges(context, applicationData));

      // Generate immediate actions
      immediateActions.push(...this.generateImmediateActions(cvGaps, jdThemes));

      const result: CoachingResult = {
        nudges: nudges.slice(0, 5), // Limit to 5 nudges as per spec
        immediateActions: immediateActions.slice(0, 3), // Top 3 actions
        jdThemes,
      };

      return {
        success: true,
        data: result,
      };
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
   * Extract key themes from job description
   */
  private extractJDThemes(jobDetail: any): string[] {
    if (!jobDetail?.jdText) return [];

    const jdText = jobDetail.jdText.toLowerCase();
    const themes = [];

    // Common job themes to look for
    const themePatterns = {
      "stakeholder-management":
        /stakeholder|client|customer|communication|collaboration/,
      "data-driven": /data|analytics|metrics|measurement|kpi|roi/,
      leadership: /lead|manage|mentor|guide|direct|supervise/,
      agile: /agile|scrum|sprint|kanban|methodology/,
      "product-management": /product|roadmap|strategy|vision|requirements/,
      technical: /technical|development|api|system|architecture/,
      growth: /growth|scale|expand|revenue|acquisition/,
      "user-experience": /user|ux|ui|experience|usability|design/,
    };

    Object.entries(themePatterns).forEach(([theme, pattern]) => {
      if (pattern.test(jdText)) {
        themes.push(theme);
      }
    });

    return themes;
  }

  /**
   * Identify gaps between CV and JD requirements
   */
  private identifyGaps(
    cvFacts: any,
    jobDetail: any
  ): Array<{
    gap: string;
    severity: "high" | "medium" | "low";
    category: string;
  }> {
    const gaps = [];
    const jdStruct = jobDetail?.jdStruct || {};
    const requiredSkills = jdStruct.skills || [];
    const cvSkills = cvFacts?.skills || [];

    // Skill gaps
    requiredSkills.forEach((requiredSkill) => {
      const hasSkill = cvSkills.some(
        (cvSkill) =>
          cvSkill.toLowerCase().includes(requiredSkill.toLowerCase()) ||
          requiredSkill.toLowerCase().includes(cvSkill.toLowerCase())
      );

      if (!hasSkill) {
        gaps.push({
          gap: requiredSkill,
          severity: this.assessSkillImportance(requiredSkill, jobDetail),
          category: "skill",
        });
      }
    });

    // Experience level gaps
    const requiredSeniority = jdStruct.seniority || "";
    const cvSeniority = this.assessCVSeniority(cvFacts);

    if (this.hasSeniorityGap(requiredSeniority, cvSeniority)) {
      gaps.push({
        gap: `${requiredSeniority} level experience`,
        severity: "high",
        category: "experience",
      });
    }

    return gaps;
  }

  /**
   * Identify strengths to emphasize based on JD alignment
   */
  private identifyStrengths(
    cvFacts: any,
    jobDetail: any
  ): Array<{
    strength: string;
    relevance: "high" | "medium" | "low";
    evidence: string;
  }> {
    const strengths = [];
    const jdText = jobDetail?.jdText?.toLowerCase() || "";

    if (cvFacts?.experience) {
      cvFacts.experience.forEach((exp) => {
        // Check if experience aligns with JD
        const expText =
          `${exp.title} ${exp.bullets?.join(" ") || ""}`.toLowerCase();

        // Look for quantified achievements
        const metrics = this.extractMetrics(expText);
        if (metrics.length > 0) {
          strengths.push({
            strength: "Quantified achievements",
            relevance: "high",
            evidence: `${exp.title} at ${exp.company}: ${metrics[0]}`,
          });
        }

        // Look for leadership experience
        if (
          /lead|manage|direct|supervise/.test(expText) &&
          /leadership|team|manage/.test(jdText)
        ) {
          strengths.push({
            strength: "Leadership experience",
            relevance: "high",
            evidence: `${exp.title} at ${exp.company}`,
          });
        }

        // Look for relevant industry experience
        if (exp.company && jdText.includes(exp.company.toLowerCase())) {
          strengths.push({
            strength: "Industry experience",
            relevance: "high",
            evidence: `Experience at ${exp.company}`,
          });
        }
      });
    }

    return strengths;
  }

  /**
   * Generate nudges about what to emphasize
   */
  private generateEmphasisNudges(
    strengths: Array<any>,
    jdThemes: string[]
  ): CoachingNudge[] {
    const nudges: CoachingNudge[] = [];

    strengths.forEach((strength) => {
      if (strength.relevance === "high") {
        nudges.push({
          category: "emphasize",
          title: `Highlight ${strength.strength}`,
          description: `Emphasize this strength in your application: ${strength.evidence}`,
          priority: "high",
        });
      }
    });

    // Theme-based emphasis nudges
    jdThemes.forEach((theme) => {
      switch (theme) {
        case "stakeholder-management":
          nudges.push({
            category: "emphasize",
            title: "Stress stakeholder communication",
            description:
              "Highlight any experience working with cross-functional teams or external clients",
            priority: "medium",
          });
          break;
        case "data-driven":
          nudges.push({
            category: "emphasize",
            title: "Quantify your impact",
            description:
              "Include specific metrics and KPIs in your bullet points",
            priority: "high",
          });
          break;
        case "leadership":
          nudges.push({
            category: "emphasize",
            title: "Showcase leadership",
            description:
              "Highlight team management, mentoring, or project leadership experience",
            priority: "high",
          });
          break;
      }
    });

    return nudges;
  }

  /**
   * Generate nudges about gaps to address
   */
  private generateGapNudges(
    gaps: Array<any>,
    jdThemes: string[]
  ): CoachingNudge[] {
    const nudges: CoachingNudge[] = [];

    gaps.forEach((gap) => {
      if (gap.severity === "high") {
        nudges.push({
          category: "gap",
          title: `Address ${gap.gap} gap`,
          description: `This appears to be a key requirement. Consider highlighting related experience or learning plans.`,
          priority: "high",
        });
      } else if (gap.severity === "medium") {
        nudges.push({
          category: "gap",
          title: `Bridge ${gap.gap} gap`,
          description: `While not critical, addressing this gap could strengthen your application.`,
          priority: "medium",
        });
      }
    });

    return nudges;
  }

  /**
   * Generate general improvement nudges
   */
  private generateImprovementNudges(
    context: AgentContext,
    applicationData?: any
  ): CoachingNudge[] {
    const nudges: CoachingNudge[] = [];

    // Check if CV lacks quantified metrics
    if (!this.hasQuantifiedMetrics(context.cvFacts)) {
      nudges.push({
        category: "improvement",
        title: "Add quantified achievements",
        description:
          "Include specific numbers, percentages, or dollar amounts to demonstrate impact",
        priority: "high",
      });
    }

    // Check if bullets are too generic
    if (this.hasGenericBullets(context.cvFacts)) {
      nudges.push({
        category: "improvement",
        title: "Make bullets more specific",
        description:
          "Replace generic responsibilities with specific achievements and outcomes",
        priority: "medium",
      });
    }

    return nudges;
  }

  /**
   * Generate immediate actions to take this week
   */
  private generateImmediateActions(
    gaps: Array<any>,
    jdThemes: string[]
  ): ImmediateAction[] {
    const actions: ImmediateAction[] = [];

    // High-priority gaps become immediate actions
    gaps
      .filter((gap) => gap.severity === "high")
      .forEach((gap) => {
        actions.push({
          action: `Research and add ${gap.gap} context to your application`,
          etaDays: 2,
        });
      });

    // Theme-based actions
    if (jdThemes.includes("data-driven")) {
      actions.push({
        action: "Quantify 3 major achievements with specific metrics",
        etaDays: 1,
      });
    }

    if (jdThemes.includes("stakeholder-management")) {
      actions.push({
        action: "Prepare examples of successful stakeholder communication",
        etaDays: 2,
      });
    }

    // General actions
    actions.push({
      action: "Research company recent news and product updates",
      etaDays: 1,
    });

    return actions;
  }

  // Helper methods
  private assessSkillImportance(
    skill: string,
    jobDetail: any
  ): "high" | "medium" | "low" {
    const jdText = jobDetail?.jdText?.toLowerCase() || "";
    const mustHavePatterns = /required|must have|essential|critical/;
    const skillContext = this.getSkillContext(skill, jdText);

    if (mustHavePatterns.test(skillContext)) {
      return "high";
    }

    // Check if mentioned multiple times
    const mentions = (jdText.match(new RegExp(skill.toLowerCase(), "g")) || [])
      .length;
    return mentions > 2 ? "medium" : "low";
  }

  private getSkillContext(skill: string, jdText: string): string {
    const index = jdText.indexOf(skill.toLowerCase());
    if (index === -1) return "";

    const start = Math.max(0, index - 50);
    const end = Math.min(jdText.length, index + skill.length + 50);
    return jdText.substring(start, end);
  }

  private assessCVSeniority(cvFacts: any): string {
    const experience = cvFacts?.experience || [];
    const totalYears = this.calculateTotalExperience(experience);

    if (totalYears >= 7) return "senior";
    if (totalYears >= 3) return "mid";
    return "junior";
  }

  private calculateTotalExperience(experience: any[]): number {
    // Simplified calculation for MVP
    return experience.length * 2; // Assume 2 years per role on average
  }

  private hasSeniorityGap(required: string, actual: string): boolean {
    const levels = { junior: 1, mid: 2, senior: 3 };
    return levels[required] > levels[actual];
  }

  private extractMetrics(text: string): string[] {
    const metricPatterns = [/\d+%/g, /\$[\d,]+/g, /\d+x/g, /\d+k\+/g];

    const metrics = [];
    metricPatterns.forEach((pattern) => {
      const matches = text.match(pattern) || [];
      metrics.push(...matches);
    });

    return metrics;
  }

  private hasQuantifiedMetrics(cvFacts: any): boolean {
    const cvText = JSON.stringify(cvFacts).toLowerCase();
    return /\d+%|\$\d+|\d+x|\d+k/.test(cvText);
  }

  private hasGenericBullets(cvFacts: any): boolean {
    const genericPhrases = [
      "responsible for",
      "assisted with",
      "participated in",
      "helped to",
      "worked on",
    ];

    const cvText = JSON.stringify(cvFacts).toLowerCase();
    return genericPhrases.some((phrase) => cvText.includes(phrase));
  }

  protected getMockResponse(): any {
    return {
      nudges: [
        {
          category: "emphasize",
          title: "Highlight leadership experience",
          description:
            "Your team management experience aligns well with this role",
          priority: "high",
        },
      ],
      immediateActions: [
        {
          action: "Quantify your team size and project impact",
          etaDays: 1,
        },
      ],
      jdThemes: ["leadership", "stakeholder-management"],
    };
  }
}
