import { BaseAgent, AgentContext, AgentResponse } from "./base-agent";

export interface ReviewResult {
  passed: boolean;
  violations: ReviewViolation[];
  suggestions: string[];
  safetyScore: number;
}

export interface ReviewViolation {
  type:
    | "fabrication"
    | "buzzword_stuffing"
    | "poor_structure"
    | "reality_breach";
  severity: "low" | "medium" | "high";
  location: string;
  description: string;
  suggestion: string;
}

/**
 * ReviewerAgent - V1 Truth & Safety Guardian
 * Ensures documents pass truth/ATS lint and reality index compliance
 * Implements User Story 6 - Writer + Reviewer Handshake
 */
export class ReviewerAgent extends BaseAgent {
  protected name = "ReviewerAgent";
  protected version = "1.0.0";

  /**
   * Review generated document for truth/safety/ATS compliance
   * Implements User Story 6 - Writer + Reviewer Handshake
   */
  async reviewDocument(
    context: AgentContext,
    document: {
      content: string;
      realityIndex: number;
      provenanceLinks: any[];
    }
  ): Promise<AgentResponse<ReviewResult>> {
    try {
      const violations: ReviewViolation[] = [];

      // Check for fabricated information
      violations.push(...this.checkForFabrications(document, context));

      // Check for buzzword stuffing
      violations.push(...this.checkBuzzwordStuffing(document));

      // Check document structure and ATS compliance
      violations.push(...this.checkStructure(document));

      // Check Reality Index compliance
      violations.push(...this.checkRealityIndexCompliance(document, context));

      const safetyScore = this.calculateSafetyScore(violations);
      const passed =
        safetyScore >= 0.7 && !violations.some((v) => v.severity === "high");

      const result: ReviewResult = {
        passed,
        violations,
        suggestions: this.generateSuggestions(violations),
        safetyScore,
      };

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "REVIEW_FAILED",
          message: error.message,
        },
      };
    }
  }

  /**
   * Check for fabricated roles, dates, certifications, companies
   */
  private checkForFabrications(
    document: any,
    context: AgentContext
  ): ReviewViolation[] {
    const violations: ReviewViolation[] = [];
    const content = document.content.toLowerCase();
    const cvFacts = context.cvFacts || {};

    // Extract companies from CV facts for verification
    const knownCompanies = this.extractKnownCompanies(cvFacts);
    const knownTitles = this.extractKnownTitles(cvFacts);

    // Simple pattern matching for companies/titles in content
    const mentionedCompanies = this.extractMentionedCompanies(content);
    const mentionedTitles = this.extractMentionedTitles(content);

    // Check for unknown companies
    mentionedCompanies.forEach((company) => {
      if (!knownCompanies.includes(company.toLowerCase())) {
        violations.push({
          type: "fabrication",
          severity: "high",
          location: `Company: ${company}`,
          description: "Company not found in CV facts",
          suggestion: "Remove or replace with known company from CV",
        });
      }
    });

    // Check for unknown titles
    mentionedTitles.forEach((title) => {
      if (
        !knownTitles.some((known) =>
          title.toLowerCase().includes(known.toLowerCase())
        )
      ) {
        violations.push({
          type: "fabrication",
          severity: "high",
          location: `Title: ${title}`,
          description: "Job title not found in CV facts",
          suggestion: "Use only job titles from your actual experience",
        });
      }
    });

    // Check for date inconsistencies
    const dateViolations = this.checkDateConsistency(content, cvFacts);
    violations.push(...dateViolations);

    return violations;
  }

  /**
   * Check for excessive keyword repetition (buzzword stuffing)
   */
  private checkBuzzwordStuffing(document: any): ReviewViolation[] {
    const violations: ReviewViolation[] = [];
    const content = document.content.toLowerCase();
    const words = content.split(/\s+/);
    const wordCount: Record<string, number> = {};

    // Count word frequencies
    words.forEach((word) => {
      const cleanWord = word.replace(/[^\w]/g, "");
      if (cleanWord.length > 3) {
        // Only check meaningful words
        wordCount[cleanWord] = (wordCount[cleanWord] || 0) + 1;
      }
    });

    // Flag words that appear more than 3 times
    Object.entries(wordCount).forEach(([word, count]) => {
      if (count > 3 && this.isBuzzword(word)) {
        violations.push({
          type: "buzzword_stuffing",
          severity: "medium",
          location: `Keyword: ${word}`,
          description: `"${word}" appears ${count} times (limit: 3)`,
          suggestion: `Reduce usage of "${word}" or use synonyms`,
        });
      }
    });

    return violations;
  }

  /**
   * Check document structure and ATS compliance
   */
  private checkStructure(document: any): ReviewViolation[] {
    const violations: ReviewViolation[] = [];
    const content = document.content;

    // Check for bullet points that are too long
    const bullets = this.extractBulletPoints(content);
    bullets.forEach((bullet, index) => {
      const lines = bullet.split("\n").filter((line) => line.trim());
      if (lines.length > 2) {
        violations.push({
          type: "poor_structure",
          severity: "low",
          location: `Bullet ${index + 1}`,
          description: "Bullet point exceeds 2 lines",
          suggestion: "Break into shorter, more impactful statements",
        });
      }

      // Check if bullet starts with action verb
      const firstWord = bullet.trim().split(" ")[0].toLowerCase();
      if (!this.isActionVerb(firstWord)) {
        violations.push({
          type: "poor_structure",
          severity: "low",
          location: `Bullet ${index + 1}`,
          description: "Bullet should start with action verb",
          suggestion: `Start with action verb instead of "${firstWord}"`,
        });
      }
    });

    return violations;
  }

  /**
   * Check Reality Index compliance
   */
  private checkRealityIndexCompliance(
    document: any,
    context: AgentContext
  ): ReviewViolation[] {
    const violations: ReviewViolation[] = [];
    const content = document.content.toLowerCase();
    const realityIndex = document.realityIndex || 1;

    // RI=0: No aspirational language allowed
    if (realityIndex === 0) {
      const aspirationalPhrases = [
        "learning",
        "in progress",
        "developing",
        "growing",
      ];
      aspirationalPhrases.forEach((phrase) => {
        if (content.includes(phrase)) {
          violations.push({
            type: "reality_breach",
            severity: "high",
            location: `Phrase: ${phrase}`,
            description: "Aspirational language not allowed at Reality Index 0",
            suggestion: "Use only verified facts from CV",
          });
        }
      });
    }

    // RI>2: Not allowed (hard cap)
    if (realityIndex > 2) {
      violations.push({
        type: "reality_breach",
        severity: "high",
        location: "Reality Index",
        description: "Reality Index cannot exceed 2",
        suggestion: "Maximum Reality Index is 2",
      });
    }

    // Check for unsupported claims
    const strongClaims = this.extractStrongClaims(content);
    strongClaims.forEach((claim) => {
      const hasProvenance = document.provenanceLinks?.some((link) =>
        content.includes(link.claimText.toLowerCase())
      );

      if (!hasProvenance) {
        violations.push({
          type: "reality_breach",
          severity: realityIndex === 0 ? "high" : "medium",
          location: `Claim: ${claim}`,
          description: "Strong claim lacks supporting evidence",
          suggestion: "Link to specific achievement or soften language",
        });
      }
    });

    return violations;
  }

  private calculateSafetyScore(violations: ReviewViolation[]): number {
    let score = 1.0;

    violations.forEach((violation) => {
      switch (violation.severity) {
        case "high":
          score -= 0.3;
          break;
        case "medium":
          score -= 0.15;
          break;
        case "low":
          score -= 0.05;
          break;
      }
    });

    return Math.max(0, score);
  }

  private generateSuggestions(violations: ReviewViolation[]): string[] {
    const suggestions = violations.map((v) => v.suggestion);

    // Add general suggestions if there are many violations
    if (violations.length > 5) {
      suggestions.push(
        "Consider reducing Reality Index for stricter fact adherence"
      );
    }

    if (violations.some((v) => v.type === "fabrication")) {
      suggestions.push(
        "Focus on your actual achievements and quantify them with real metrics"
      );
    }

    return [...new Set(suggestions)]; // Remove duplicates
  }

  // Helper methods for content analysis
  private extractKnownCompanies(cvFacts: any): string[] {
    const companies = [];
    if (cvFacts.experience) {
      cvFacts.experience.forEach((exp) => {
        if (exp.company) companies.push(exp.company.toLowerCase());
      });
    }
    return companies;
  }

  private extractKnownTitles(cvFacts: any): string[] {
    const titles = [];
    if (cvFacts.experience) {
      cvFacts.experience.forEach((exp) => {
        if (exp.title) titles.push(exp.title.toLowerCase());
      });
    }
    return titles;
  }

  private extractMentionedCompanies(content: string): string[] {
    // Simple extraction - in production, use NER
    const companyPattern = /at ([A-Z][a-z]+(?: [A-Z][a-z]+)*)/g;
    const matches = content.match(companyPattern) || [];
    return matches.map((match) => match.replace("at ", ""));
  }

  private extractMentionedTitles(content: string): string[] {
    // Simple extraction - in production, use NER
    const titlePattern =
      /(Product Manager|Software Engineer|Data Scientist|Developer|Analyst|Director|Manager)/gi;
    const matches = content.match(titlePattern) || [];
    return matches;
  }

  private checkDateConsistency(
    content: string,
    cvFacts: any
  ): ReviewViolation[] {
    // Simplified date checking for MVP
    // In production, implement comprehensive date validation
    return [];
  }

  private extractBulletPoints(content: string): string[] {
    const bullets = content
      .split(/[•\-\*]/)
      .filter((bullet) => bullet.trim().length > 10);
    return bullets;
  }

  private extractStrongClaims(content: string): string[] {
    // Pattern for strong achievement claims
    const strongClaimPatterns = [
      /increased .* by \d+%/gi,
      /reduced .* by \d+%/gi,
      /delivered .* worth \$\d+/gi,
      /led .* team of \d+/gi,
      /managed .* budget of \$\d+/gi,
    ];

    const claims = [];
    strongClaimPatterns.forEach((pattern) => {
      const matches = content.match(pattern) || [];
      claims.push(...matches);
    });

    return claims;
  }

  private isBuzzword(word: string): boolean {
    const buzzwords = [
      "synergy",
      "leverage",
      "optimize",
      "streamline",
      "innovative",
      "strategic",
      "dynamic",
      "proactive",
      "results-driven",
      "passionate",
    ];
    return buzzwords.includes(word.toLowerCase());
  }

  private isActionVerb(word: string): boolean {
    const actionVerbs = [
      "achieved",
      "built",
      "created",
      "developed",
      "implemented",
      "led",
      "managed",
      "designed",
      "improved",
      "increased",
      "reduced",
      "delivered",
      "established",
      "coordinated",
      "facilitated",
      "optimized",
      "streamlined",
    ];
    return actionVerbs.includes(word.toLowerCase());
  }

  protected getMockResponse(): any {
    return {
      passed: true,
      violations: [],
      suggestions: ["Document looks good!"],
      safetyScore: 0.95,
    };
  }
}
