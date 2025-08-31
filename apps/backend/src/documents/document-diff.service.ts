import { Injectable } from "@nestjs/common";
import {
  DocumentContent,
  CoverLetterContent,
} from "./document-generator.service";

export interface DiffChange {
  type: "added" | "removed" | "modified";
  section: string;
  originalText?: string;
  modifiedText?: string;
  reason: string;
  sourceFact: string;
}

export interface DocumentDiffResult {
  documentId: string;
  changes: DiffChange[];
  summary: {
    addedCount: number;
    removedCount: number;
    modifiedCount: number;
    keyChanges: string[];
  };
}

@Injectable()
export class DocumentDiffService {
  /**
   * Compare generated CV with base CV to show what was tailored
   */
  async generateCvDiff(
    originalContent: DocumentContent,
    tailoredContent: DocumentContent,
    documentId: string,
    jobTitle: string
  ): Promise<DocumentDiffResult> {
    const changes: DiffChange[] = [];

    // Compare summary
    if (originalContent.summary !== tailoredContent.summary) {
      changes.push({
        type: "modified",
        section: "Professional Summary",
        originalText: originalContent.summary,
        modifiedText: tailoredContent.summary,
        reason: `Emphasized skills relevant to ${jobTitle} role`,
        sourceFact: "profile_summary",
      });
    }

    // Compare skills
    const originalSkills = new Set(originalContent.skills);
    const tailoredSkills = new Set(tailoredContent.skills);

    // Added skills
    tailoredSkills.forEach((skill) => {
      if (!originalSkills.has(skill)) {
        changes.push({
          type: "added",
          section: "Core Skills",
          modifiedText: skill,
          reason: `Added skill relevant to job requirements`,
          sourceFact: "resume_facts",
        });
      }
    });

    // Removed skills
    originalSkills.forEach((skill) => {
      if (!tailoredSkills.has(skill)) {
        changes.push({
          type: "removed",
          section: "Core Skills",
          originalText: skill,
          reason: `Removed to focus on most relevant skills`,
          sourceFact: "resume_facts",
        });
      }
    });

    // Compare experience
    this.compareExperience(
      originalContent.experience,
      tailoredContent.experience,
      changes
    );

    const summary = this.calculateDiffSummary(changes);

    return {
      documentId,
      changes,
      summary,
    };
  }

  /**
   * Compare generated cover letter with template to show personalization
   */
  async generateCoverLetterDiff(
    templateContent: CoverLetterContent,
    tailoredContent: CoverLetterContent,
    documentId: string,
    companyName: string
  ): Promise<DocumentDiffResult> {
    const changes: DiffChange[] = [];

    // Compare opening
    if (templateContent.opening !== tailoredContent.opening) {
      changes.push({
        type: "modified",
        section: "Opening Paragraph",
        originalText: templateContent.opening,
        modifiedText: tailoredContent.opening,
        reason: `Personalized opening for ${companyName}`,
        sourceFact: "job_research",
      });
    }

    // Compare body paragraphs
    for (
      let i = 0;
      i < Math.max(templateContent.body.length, tailoredContent.body.length);
      i++
    ) {
      const originalParagraph = templateContent.body[i];
      const tailoredParagraph = tailoredContent.body[i];

      if (!originalParagraph && tailoredParagraph) {
        changes.push({
          type: "added",
          section: `Body Paragraph ${i + 1}`,
          modifiedText: tailoredParagraph,
          reason: "Added paragraph to address specific job requirements",
          sourceFact: "resume_facts",
        });
      } else if (originalParagraph && !tailoredParagraph) {
        changes.push({
          type: "removed",
          section: `Body Paragraph ${i + 1}`,
          originalText: originalParagraph,
          reason: "Removed generic content",
          sourceFact: "template",
        });
      } else if (originalParagraph !== tailoredParagraph) {
        changes.push({
          type: "modified",
          section: `Body Paragraph ${i + 1}`,
          originalText: originalParagraph,
          modifiedText: tailoredParagraph,
          reason: `Tailored content for ${companyName} and role`,
          sourceFact: "resume_facts",
        });
      }
    }

    const summary = this.calculateDiffSummary(changes);

    return {
      documentId,
      changes,
      summary,
    };
  }

  private compareExperience(
    originalExperience: DocumentContent["experience"],
    tailoredExperience: DocumentContent["experience"],
    changes: DiffChange[]
  ): void {
    // Create maps for easier comparison
    const originalByCompany = new Map(
      originalExperience.map((exp) => [`${exp.company}-${exp.title}`, exp])
    );
    const tailoredByCompany = new Map(
      tailoredExperience.map((exp) => [`${exp.company}-${exp.title}`, exp])
    );

    // Check for added/removed experience entries
    tailoredByCompany.forEach((exp, key) => {
      if (!originalByCompany.has(key)) {
        changes.push({
          type: "added",
          section: "Professional Experience",
          modifiedText: `${exp.title} at ${exp.company}`,
          reason: "Added relevant experience for this role",
          sourceFact: "resume_facts",
        });
      }
    });

    originalByCompany.forEach((exp, key) => {
      if (!tailoredByCompany.has(key)) {
        changes.push({
          type: "removed",
          section: "Professional Experience",
          originalText: `${exp.title} at ${exp.company}`,
          reason: "Removed less relevant experience to focus on key roles",
          sourceFact: "resume_facts",
        });
      }
    });

    // Compare bullets for existing experience
    tailoredByCompany.forEach((tailoredExp, key) => {
      const originalExp = originalByCompany.get(key);
      if (originalExp) {
        this.compareBullets(originalExp, tailoredExp, changes);
      }
    });
  }

  private compareBullets(
    originalExp: DocumentContent["experience"][0],
    tailoredExp: DocumentContent["experience"][0],
    changes: DiffChange[]
  ): void {
    const originalBullets = new Set(originalExp.bullets);
    const tailoredBullets = new Set(tailoredExp.bullets);

    // Added bullets
    tailoredBullets.forEach((bullet) => {
      if (!originalBullets.has(bullet)) {
        changes.push({
          type: "added",
          section: `Experience - ${tailoredExp.company}`,
          modifiedText: bullet,
          reason: "Added bullet point to highlight relevant achievement",
          sourceFact: "resume_facts",
        });
      }
    });

    // Removed bullets
    originalBullets.forEach((bullet) => {
      if (!tailoredBullets.has(bullet)) {
        changes.push({
          type: "removed",
          section: `Experience - ${originalExp.company}`,
          originalText: bullet,
          reason: "Removed bullet to focus on most relevant achievements",
          sourceFact: "resume_facts",
        });
      }
    });

    // Check for modified bullets (this is more complex and might require fuzzy matching)
    // For now, we'll detect if the total count changed without 1:1 matches
    const addedCount = tailoredExp.bullets.filter(
      (b) => !originalBullets.has(b)
    ).length;
    const removedCount = originalExp.bullets.filter(
      (b) => !tailoredBullets.has(b)
    ).length;

    if (addedCount > 0 && removedCount > 0 && addedCount === removedCount) {
      // Likely modified rather than added/removed
      changes.push({
        type: "modified",
        section: `Experience - ${tailoredExp.company}`,
        originalText: `${removedCount} bullet points`,
        modifiedText: `${addedCount} enhanced bullet points`,
        reason: "Enhanced bullet points to better match job requirements",
        sourceFact: "resume_facts",
      });
    }
  }

  private calculateDiffSummary(
    changes: DiffChange[]
  ): DocumentDiffResult["summary"] {
    const addedCount = changes.filter((c) => c.type === "added").length;
    const removedCount = changes.filter((c) => c.type === "removed").length;
    const modifiedCount = changes.filter((c) => c.type === "modified").length;

    // Extract key changes for summary
    const keyChanges: string[] = [];

    if (changes.some((c) => c.section === "Professional Summary")) {
      keyChanges.push("Tailored professional summary");
    }

    if (changes.some((c) => c.section === "Core Skills")) {
      keyChanges.push("Optimized skills section");
    }

    const experienceChanges = changes.filter((c) =>
      c.section.includes("Experience")
    );
    if (experienceChanges.length > 0) {
      keyChanges.push(
        `Enhanced ${experienceChanges.length} experience entries`
      );
    }

    const coverLetterChanges = changes.filter((c) =>
      c.section.includes("Paragraph")
    );
    if (coverLetterChanges.length > 0) {
      keyChanges.push("Personalized cover letter content");
    }

    return {
      addedCount,
      removedCount,
      modifiedCount,
      keyChanges,
    };
  }

  /**
   * Generate a simple text diff for debugging
   */
  generateTextDiff(original: string, modified: string): string[] {
    const originalLines = original.split("\n");
    const modifiedLines = modified.split("\n");
    const diff: string[] = [];

    // Simple line-by-line comparison
    const maxLines = Math.max(originalLines.length, modifiedLines.length);

    for (let i = 0; i < maxLines; i++) {
      const originalLine = originalLines[i] || "";
      const modifiedLine = modifiedLines[i] || "";

      if (originalLine !== modifiedLine) {
        if (originalLine && modifiedLine) {
          diff.push(`~ ${modifiedLine}`);
        } else if (modifiedLine) {
          diff.push(`+ ${modifiedLine}`);
        } else if (originalLine) {
          diff.push(`- ${originalLine}`);
        }
      } else if (originalLine) {
        diff.push(`  ${originalLine}`);
      }
    }

    return diff;
  }
}
