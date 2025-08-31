import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { StorageService } from "../storage/storage.service";
import {
  DocumentGeneratorService,
  DocumentContent,
  CoverLetterContent,
} from "./document-generator.service";
import { DocumentDiffService } from "./document-diff.service";
import { DocumentFormat, DocumentKind } from "../common/dto";

export interface VariantConfig {
  label: "concise" | "balanced" | "detailed";
  description: string;
  coachingNote: string;
  maxExperienceEntries: number;
  maxBulletsPerJob: number;
  summaryMaxWords: number;
  includeAllSkills: boolean;
}

export interface GeneratedVariant {
  variantLabel: string;
  documents: Array<{
    id: string;
    kind: DocumentKind;
    format: DocumentFormat;
    uri: string;
    templateStyle: string;
    previewUrl: string;
    downloadUrl: string;
  }>;
  coachingNote: string;
}

@Injectable()
export class DocumentVariantsService {
  private readonly variantConfigs: VariantConfig[] = [
    {
      label: "concise",
      description: "Focused on most relevant experience",
      coachingNote:
        "Best for senior roles or when you want to highlight only the most relevant experience. Keeps hiring managers focused.",
      maxExperienceEntries: 3,
      maxBulletsPerJob: 3,
      summaryMaxWords: 50,
      includeAllSkills: false,
    },
    {
      label: "balanced",
      description: "Comprehensive but selective",
      coachingNote:
        "Good all-around choice that shows breadth while staying focused. Works well for most mid-level positions.",
      maxExperienceEntries: 5,
      maxBulletsPerJob: 4,
      summaryMaxWords: 75,
      includeAllSkills: false,
    },
    {
      label: "detailed",
      description: "Shows full career progression",
      coachingNote:
        "Use when the role requires extensive experience or when applying to roles where depth matters more than brevity.",
      maxExperienceEntries: 8,
      maxBulletsPerJob: 6,
      summaryMaxWords: 100,
      includeAllSkills: true,
    },
  ];

  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
    private documentGenerator: DocumentGeneratorService,
    private documentDiff: DocumentDiffService
  ) {}

  /**
   * Generate multiple variants for an application
   */
  async generateVariants(
    applicationId: string,
    variantLabels: string[],
    targetFormat: DocumentFormat = DocumentFormat.docx
  ): Promise<{
    variants: GeneratedVariant[];
    recommendedVariant: string;
  }> {
    // Get application and job details
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: true,
      },
    });

    if (!application) {
      throw new Error(`Application ${applicationId} not found`);
    }

    // Get user's CV data (this would come from the CV service)
    const baseContent = await this.getBaseDocumentContent(application.userId);

    // Generate variants
    const variants: GeneratedVariant[] = [];

    for (const label of variantLabels) {
      const config = this.variantConfigs.find((c) => c.label === label);
      if (!config) {
        throw new Error(`Unknown variant label: ${label}`);
      }

      const variant = await this.generateSingleVariant(
        applicationId,
        baseContent,
        config,
        application.job,
        targetFormat
      );

      variants.push(variant);
    }

    // Determine recommended variant based on job characteristics
    const recommendedVariant = this.selectRecommendedVariant(
      application.job.title,
      application.job.company,
      variantLabels
    );

    return {
      variants,
      recommendedVariant,
    };
  }

  private async generateSingleVariant(
    applicationId: string,
    baseContent: DocumentContent,
    config: VariantConfig,
    job: any,
    targetFormat: DocumentFormat
  ): Promise<GeneratedVariant> {
    // Tailor content according to variant config
    const tailoredCvContent = this.tailorContentForVariant(
      baseContent,
      config,
      job
    );
    const tailoredCoverContent = this.generateCoverLetterContent(
      baseContent,
      job
    );

    // Select template
    const template = this.documentGenerator.selectTemplateForJob(
      job.title,
      job.company,
      job.jdStruct?.industry
    );

    // Generate documents
    const documents = [];
    const timestamp = new Date().toISOString();

    // Generate CV
    const cvDocx = await this.documentGenerator.generateCvDocx(
      tailoredCvContent,
      template
    );
    const cvUri = await this.storage.save(
      cvDocx,
      `applications/${applicationId}/cv-${config.label}-${timestamp}.docx`,
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    const cvDocId = this.generateDocumentId();
    documents.push({
      id: cvDocId,
      kind: DocumentKind.cv,
      format: DocumentFormat.docx,
      uri: cvUri,
      templateStyle: template.style,
      previewUrl: `/applications/${applicationId}/documents/${cvDocId}/preview`,
      downloadUrl: `/applications/${applicationId}/documents/${cvDocId}/download`,
    });

    // Generate PDF if requested
    if (targetFormat === DocumentFormat.pdf) {
      const cvPdf = await this.documentGenerator.convertDocxToPdf(cvDocx);
      const cvPdfUri = await this.storage.save(
        cvPdf,
        `applications/${applicationId}/cv-${config.label}-${timestamp}.pdf`,
        "application/pdf"
      );

      const cvPdfDocId = this.generateDocumentId();
      documents.push({
        id: cvPdfDocId,
        kind: DocumentKind.cv,
        format: DocumentFormat.pdf,
        uri: cvPdfUri,
        templateStyle: template.style,
        previewUrl: `/applications/${applicationId}/documents/${cvPdfDocId}/preview`,
        downloadUrl: `/applications/${applicationId}/documents/${cvPdfDocId}/download`,
      });
    }

    // Generate Cover Letter
    const coverDocx = await this.documentGenerator.generateCoverLetterDocx(
      tailoredCoverContent,
      template
    );
    const coverUri = await this.storage.save(
      coverDocx,
      `applications/${applicationId}/cover-${config.label}-${timestamp}.docx`,
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    const coverDocId = this.generateDocumentId();
    documents.push({
      id: coverDocId,
      kind: DocumentKind.cover,
      format: DocumentFormat.docx,
      uri: coverUri,
      templateStyle: template.style,
      previewUrl: `/applications/${applicationId}/documents/${coverDocId}/preview`,
      downloadUrl: `/applications/${applicationId}/documents/${coverDocId}/download`,
    });

    // Store document records in database
    for (const doc of documents) {
      await this.prisma.applicationDoc.create({
        data: {
          id: doc.id,
          applicationId,
          kind: doc.kind,
          format: doc.format,
          blobUri: doc.uri,
          variantLabel: config.label,
          language: "en", // TODO: Get from application context
          checksum: "placeholder", // TODO: Calculate actual checksum
        },
      });
    }

    return {
      variantLabel: config.label,
      documents,
      coachingNote: config.coachingNote,
    };
  }

  private tailorContentForVariant(
    baseContent: DocumentContent,
    config: VariantConfig,
    job: any
  ): DocumentContent {
    // This is a simplified implementation
    // In production, this would use AI to intelligently select and tailor content

    return {
      ...baseContent,
      // Limit experience entries
      experience: baseContent.experience
        .slice(0, config.maxExperienceEntries)
        .map((exp) => ({
          ...exp,
          bullets: exp.bullets.slice(0, config.maxBulletsPerJob),
        })),

      // Limit skills if needed
      skills: config.includeAllSkills
        ? baseContent.skills
        : baseContent.skills.slice(0, 12), // Reasonable limit

      // Truncate summary if needed
      summary: this.truncateText(baseContent.summary, config.summaryMaxWords),
    };
  }

  private generateCoverLetterContent(
    baseContent: DocumentContent,
    job: any
  ): CoverLetterContent {
    // Simplified cover letter generation
    // In production, this would use AI to generate personalized content

    return {
      contact: baseContent.contact,
      company: {
        name: job.company,
        address: "", // TODO: Get from job data
      },
      salutation: "Dear Hiring Manager,",
      opening: `I am writing to express my strong interest in the ${job.title} position at ${job.company}.`,
      body: [
        `With my background in ${baseContent.skills.slice(0, 3).join(", ")}, I am excited about the opportunity to contribute to your team.`,
        `In my recent role at ${baseContent.experience[0]?.company}, I successfully ${baseContent.experience[0]?.bullets[0] || "delivered key projects"}.`,
        `I am particularly drawn to ${job.company} because of your innovative approach and would welcome the opportunity to discuss how my skills align with your needs.`,
      ],
      closing: "Sincerely,",
      signature: baseContent.contact.name,
    };
  }

  private selectRecommendedVariant(
    jobTitle: string,
    companyName: string,
    availableVariants: string[]
  ): string {
    const lowerTitle = jobTitle.toLowerCase();

    // Senior roles typically prefer concise
    if (
      lowerTitle.includes("senior") ||
      lowerTitle.includes("lead") ||
      lowerTitle.includes("principal")
    ) {
      return availableVariants.includes("concise")
        ? "concise"
        : availableVariants[0];
    }

    // Entry level might benefit from detailed
    if (
      lowerTitle.includes("junior") ||
      lowerTitle.includes("entry") ||
      lowerTitle.includes("associate")
    ) {
      return availableVariants.includes("detailed")
        ? "detailed"
        : availableVariants[0];
    }

    // Default to balanced
    return availableVariants.includes("balanced")
      ? "balanced"
      : availableVariants[0];
  }

  private truncateText(text: string, maxWords: number): string {
    const words = text.split(" ");
    if (words.length <= maxWords) {
      return text;
    }
    return words.slice(0, maxWords).join(" ") + "...";
  }

  private generateDocumentId(): string {
    return `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async getBaseDocumentContent(
    userId: string
  ): Promise<DocumentContent> {
    // This would integrate with the CV service to get the user's base content
    // For now, returning a placeholder
    return {
      summary:
        "Experienced professional with strong technical and leadership skills.",
      experience: [
        {
          company: "Tech Corp",
          title: "Software Engineer",
          duration: "2020-2023",
          bullets: [
            "Developed and maintained web applications using React and Node.js",
            "Led team of 3 developers on key product features",
            "Improved application performance by 40%",
          ],
        },
      ],
      skills: [
        "JavaScript",
        "React",
        "Node.js",
        "TypeScript",
        "AWS",
        "PostgreSQL",
      ],
      education: [
        {
          institution: "University of Technology",
          degree: "Bachelor of Computer Science",
          year: "2020",
        },
      ],
      contact: {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
      },
    };
  }

  /**
   * Get variant configurations
   */
  getVariantConfigs(): VariantConfig[] {
    return [...this.variantConfigs];
  }
}
