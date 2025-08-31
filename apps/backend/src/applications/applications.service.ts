import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { StorageService } from "../storage/storage.service";
import { CvService } from "../cv/cv.service";
import { JobsService } from "../jobs/jobs.service";
import {
  ApplicationGenerateRequestDto,
  ApplicationGenerateResponseDto,
  ApplicationListDto,
  ApplicationDetailDto,
  ApplicationSummaryDto,
  ApplicationStatus,
  GeneratedDocDto,
  DocumentKind,
  DocumentFormat,
  DecisionDto,
  NoteDto,
  StatusUpdateDto,
} from "../common/dto";

interface GenerationContext {
  cvPreview: any;
  jobDetail: any;
  realityIndex: number;
  persona?: string;
}

@Injectable()
export class ApplicationsService {
  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
    private cvService: CvService,
    private jobsService: JobsService
  ) {}

  async generateApplication(
    userId: string,
    request: ApplicationGenerateRequestDto
  ): Promise<ApplicationGenerateResponseDto> {
    // Get CV and Job data
    const cvPreview = await this.cvService.getCvPreview(userId);
    const jobDetail = await this.jobsService.getJob(request.jobId);

    // Determine reality index (V0: simple default, V1: agent decides)
    const realityIndex = request.realityIndex ?? 1; // Default to balanced

    // Generate context for document creation
    const context: GenerationContext = {
      cvPreview,
      jobDetail,
      realityIndex,
      persona: this.inferPersona(cvPreview, jobDetail),
    };

    // Create application record
    const application = await this.prisma.application.create({
      data: {
        userId,
        jobId: request.jobId,
        status: ApplicationStatus.Found,
      },
    });

    // Generate documents
    const docs: GeneratedDocDto[] = [];

    // Generate CV
    const cvContent = await this.generateTailoredCv(context);
    const cvUri = await this.saveDocument(
      application.id,
      DocumentKind.cv,
      DocumentFormat.md,
      cvContent,
      request.language
    );
    docs.push({
      kind: DocumentKind.cv,
      format: DocumentFormat.md,
      uri: cvUri,
      variantLabel: "balanced",
      language: request.language,
    });

    // Generate Cover Letter
    const coverContent = await this.generateTailoredCoverLetter(context);
    const coverUri = await this.saveDocument(
      application.id,
      DocumentKind.cover,
      DocumentFormat.md,
      coverContent,
      request.language
    );
    docs.push({
      kind: DocumentKind.cover,
      format: DocumentFormat.md,
      uri: coverUri,
      variantLabel: "balanced",
      language: request.language,
    });

    // Create decision log
    const decision: DecisionDto = {
      persona: context.persona,
      realityIndex: context.realityIndex,
      signals: this.getMatchSignals(context),
      keywordsEmphasized: this.getEmphasizedKeywords(context),
    };

    await this.prisma.decisionLog.create({
      data: {
        applicationId: application.id,
        personaLabel: decision.persona,
        realityIndex: decision.realityIndex,
        signalsJson: decision.signals,
        keywordsEmphasized: decision.keywordsEmphasized,
      },
    });

    return {
      applicationId: application.id,
      docs,
      decision,
    };
  }

  async listApplications(
    userId: string,
    status?: ApplicationStatus,
    page = 1,
    pageSize = 20
  ): Promise<ApplicationListDto> {
    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    const [applications, total] = await Promise.all([
      this.prisma.application.findMany({
        where,
        include: {
          job: {
            select: {
              company: true,
              title: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.application.count({ where }),
    ]);

    const items: ApplicationSummaryDto[] = applications.map((app) => ({
      id: app.id,
      company: app.job.company,
      title: app.job.title,
      status: app.status as ApplicationStatus,
      createdAt: app.createdAt.toISOString(),
      appliedAt: app.appliedAt?.toISOString(),
    }));

    return {
      items,
      page,
      pageSize,
      total,
    };
  }

  async getApplicationDetail(
    userId: string,
    applicationId: string
  ): Promise<ApplicationDetailDto> {
    const application = await this.prisma.application.findFirst({
      where: { id: applicationId, userId },
      include: {
        job: true,
        docs: true,
        notes: true,
        decisions: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!application) {
      throw new Error("Application not found");
    }

    const decision = application.decisions[0];

    return {
      id: application.id,
      job: {
        id: application.job.id,
        company: application.job.company,
        title: application.job.title,
        location: application.job.location,
        jdText: application.job.jdText,
        jdStruct: application.job.jdStructJson as any,
        firstSeenAt: application.job.createdAt.toISOString(),
      },
      status: application.status as ApplicationStatus,
      notes: application.notes.map((note) => ({
        id: note.id,
        text: note.text,
        createdAt: note.createdAt.toISOString(),
      })),
      docs: application.docs.map((doc) => ({
        kind: doc.kind as DocumentKind,
        format: doc.format as DocumentFormat,
        uri: doc.blobUri,
        variantLabel: doc.variantLabel,
        language: doc.language,
      })),
      decision: decision
        ? {
            persona: decision.personaLabel,
            realityIndex: decision.realityIndex,
            signals: decision.signalsJson as string[],
            keywordsEmphasized: decision.keywordsEmphasized as string[],
          }
        : undefined,
    };
  }

  async addNote(
    userId: string,
    applicationId: string,
    text: string
  ): Promise<NoteDto> {
    // Verify application belongs to user
    const application = await this.prisma.application.findFirst({
      where: { id: applicationId, userId },
    });

    if (!application) {
      throw new Error("Application not found");
    }

    const note = await this.prisma.note.create({
      data: {
        applicationId,
        text,
      },
    });

    return {
      id: note.id,
      text: note.text,
      createdAt: note.createdAt.toISOString(),
    };
  }

  async updateStatus(
    userId: string,
    applicationId: string,
    status: ApplicationStatus
  ): Promise<ApplicationSummaryDto> {
    // Verify application belongs to user
    const application = await this.prisma.application.findFirst({
      where: { id: applicationId, userId },
      include: {
        job: {
          select: {
            company: true,
            title: true,
          },
        },
      },
    });

    if (!application) {
      throw new Error("Application not found");
    }

    const updatedApp = await this.prisma.application.update({
      where: { id: applicationId },
      data: {
        status,
        appliedAt:
          status === ApplicationStatus.Applied
            ? new Date()
            : application.appliedAt,
      },
      include: {
        job: {
          select: {
            company: true,
            title: true,
          },
        },
      },
    });

    return {
      id: updatedApp.id,
      company: updatedApp.job.company,
      title: updatedApp.job.title,
      status: updatedApp.status as ApplicationStatus,
      createdAt: updatedApp.createdAt.toISOString(),
      appliedAt: updatedApp.appliedAt?.toISOString(),
    };
  }

  private async saveDocument(
    applicationId: string,
    kind: DocumentKind,
    format: DocumentFormat,
    content: string,
    language?: string
  ): Promise<string> {
    const fileName = `${kind}-${Date.now()}.${format}`;
    const path = `applications/${applicationId}/${fileName}`;

    const uri = await this.storage.save(
      Buffer.from(content, "utf-8"),
      path,
      "text/markdown"
    );

    await this.prisma.applicationDoc.create({
      data: {
        applicationId,
        kind,
        format,
        blobUri: uri,
        language,
      },
    });

    return uri;
  }

  private inferPersona(cvPreview: any, jobDetail: any): string {
    // Simple persona inference for V0
    // In V1, this will be more sophisticated with agent logic

    const jobTitle = jobDetail.title?.toLowerCase() || "";

    if (jobTitle.includes("product manager") || jobTitle.includes("pm")) {
      return "Product Manager";
    } else if (
      jobTitle.includes("developer") ||
      jobTitle.includes("engineer")
    ) {
      return "Software Engineer";
    } else if (jobTitle.includes("data")) {
      return "Data Professional";
    } else if (jobTitle.includes("design")) {
      return "Designer";
    } else if (jobTitle.includes("analyst")) {
      return "Analyst";
    }

    return "Professional";
  }

  private getMatchSignals(context: GenerationContext): string[] {
    const signals: string[] = [];
    const cvSkills = context.cvPreview.skills || [];
    const jobSkills = context.jobDetail.jdStruct?.skills || [];

    // Find matching skills
    const matchingSkills = cvSkills.filter((skill: string) =>
      jobSkills.some(
        (jobSkill: string) =>
          jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(jobSkill.toLowerCase())
      )
    );

    if (matchingSkills.length > 0) {
      signals.push(
        `${matchingSkills.length} matching skills: ${matchingSkills.slice(0, 3).join(", ")}`
      );
    }

    // Check experience relevance
    const experience = context.cvPreview.experience || [];
    const relevantExp = experience.filter((exp: any) =>
      exp.title
        ?.toLowerCase()
        .includes(context.jobDetail.title?.toLowerCase().split(" ")[0] || "")
    );

    if (relevantExp.length > 0) {
      signals.push(`Relevant experience in similar roles`);
    }

    return signals;
  }

  private getEmphasizedKeywords(context: GenerationContext): string[] {
    const jobSkills = context.jobDetail.jdStruct?.skills || [];
    const cvSkills = context.cvPreview.skills || [];

    // Return matching skills that should be emphasized
    return jobSkills
      .filter((skill: string) =>
        cvSkills.some(
          (cvSkill: string) =>
            cvSkill.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(cvSkill.toLowerCase())
        )
      )
      .slice(0, 5);
  }

  private async generateTailoredCv(
    context: GenerationContext
  ): Promise<string> {
    // V0: Simple template-based generation
    // V1: Will use LLM for sophisticated tailoring

    const { cvPreview, jobDetail, realityIndex, persona } = context;

    let markdown = `# ${cvPreview.summary || "Professional CV"}\n\n`;

    // Add emphasis based on job requirements
    if (jobDetail.jdStruct?.skills?.length > 0) {
      markdown += `## Key Skills\n\n`;
      const relevantSkills =
        cvPreview.skills?.filter((skill: string) =>
          jobDetail.jdStruct.skills.some(
            (jobSkill: string) =>
              jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
              skill.toLowerCase().includes(jobSkill.toLowerCase())
          )
        ) || [];

      const otherSkills =
        cvPreview.skills?.filter(
          (skill: string) => !relevantSkills.includes(skill)
        ) || [];

      // Emphasize relevant skills first
      if (relevantSkills.length > 0) {
        markdown +=
          relevantSkills.map((skill) => `- **${skill}**`).join("\n") + "\n";
      }
      if (otherSkills.length > 0) {
        markdown += otherSkills.map((skill) => `- ${skill}`).join("\n") + "\n";
      }
      markdown += "\n";
    }

    // Experience section
    if (cvPreview.experience?.length > 0) {
      markdown += `## Professional Experience\n\n`;
      for (const exp of cvPreview.experience) {
        markdown += `### ${exp.title} at ${exp.company}\n`;
        if (exp.startDate || exp.endDate) {
          markdown += `*${exp.startDate || ""} - ${exp.endDate || "Present"}*\n\n`;
        }
        if (exp.bullets?.length > 0) {
          markdown +=
            exp.bullets.map((bullet: string) => `- ${bullet}`).join("\n") +
            "\n";
        }
        markdown += "\n";
      }
    }

    // Education section
    if (cvPreview.education?.length > 0) {
      markdown += `## Education\n\n`;
      for (const edu of cvPreview.education) {
        markdown += `### ${edu.degree} - ${edu.institution}\n`;
        if (edu.year) {
          markdown += `*${edu.year}*\n`;
        }
        markdown += "\n";
      }
    }

    return markdown;
  }

  private async generateTailoredCoverLetter(
    context: GenerationContext
  ): Promise<string> {
    // V0: Simple template-based generation
    // V1: Will use LLM for sophisticated personalization

    const { cvPreview, jobDetail, persona } = context;

    const company = jobDetail.company || "the company";
    const position = jobDetail.title || "this position";

    let markdown = `# Cover Letter\n\n`;
    markdown += `Dear Hiring Manager,\n\n`;

    // Opening paragraph
    markdown += `I am writing to express my strong interest in the ${position} position at ${company}. `;
    markdown += `With my background as a ${persona?.toLowerCase() || "professional"}, I am excited about the opportunity to contribute to your team.\n\n`;

    // Middle paragraph - highlight relevant experience
    const relevantExp = cvPreview.experience?.[0]; // Most recent experience
    if (relevantExp) {
      markdown += `In my recent role as ${relevantExp.title} at ${relevantExp.company}, `;
      if (relevantExp.bullets?.length > 0) {
        markdown += `I ${relevantExp.bullets[0].toLowerCase().replace(/^[^a-z]*/, "")}`;
      } else {
        markdown += `I gained valuable experience that aligns well with your requirements`;
      }
      markdown += `. `;
    }

    // Mention matching skills
    const matchingSkills = this.getEmphasizedKeywords(context);
    if (matchingSkills.length > 0) {
      markdown += `My expertise in ${matchingSkills.slice(0, 3).join(", ")} `;
      markdown += `makes me well-suited for this role.\n\n`;
    } else {
      markdown += `This experience has prepared me well for the challenges of this role.\n\n`;
    }

    // Closing paragraph
    markdown += `I am eager to bring my skills and enthusiasm to ${company} and contribute to your continued success. `;
    markdown += `Thank you for considering my application. I look forward to the opportunity to discuss how I can add value to your team.\n\n`;

    markdown += `Best regards,\n`;
    markdown += `[Your Name]`;

    return markdown;
  }
}
