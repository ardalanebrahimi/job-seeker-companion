import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { StorageService } from "../storage/storage.service";
import { CvService } from "../cv/cv.service";
import { JobsService } from "../jobs/jobs.service";
import {
  AgentOrchestrator,
  AgentContext,
  V1GenerationRequest,
} from "../agents";
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
  NoteCreateDto,
  StatusUpdateDto,
  ReminderDto,
  ReminderCreateDto,
  ReminderWithApplicationDto,
  CoachingHintsDto,
  ApplicationHistoryDto,
  DuplicateCheckResponseDto,
} from "../common/dto";

@Injectable()
export class ApplicationsService {
  private agentOrchestrator: AgentOrchestrator;

  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
    private cvService: CvService,
    private jobsService: JobsService
  ) {
    this.agentOrchestrator = new AgentOrchestrator();
  }

  /**
   * Generate application using V1 agent orchestration
   * Implements auto-decision, Reality Index, and explainability
   */
  async generateApplication(
    userId: string,
    request: ApplicationGenerateRequestDto
  ): Promise<ApplicationGenerateResponseDto> {
    // Get CV and Job data
    const cvPreview = await this.cvService.getCvPreview(userId);
    const jobDetail = await this.jobsService.getJob(request.jobId);

    // Build agent context
    const context: AgentContext = {
      userId,
      jobId: request.jobId,
      cvFacts: cvPreview,
      jobDetail,
      language: request.language,
    };

    // Build V1 generation request
    const v1Request: V1GenerationRequest = {
      jobId: request.jobId,
      realityIndex: request.realityIndex,
      language: request.language,
      personaHint: request.personaHint,
      stylePreference: request.stylePreference,
    };

    // Execute V1 agent orchestration
    const orchestrationResult =
      await this.agentOrchestrator.generateApplication(context, v1Request);

    if (!orchestrationResult.success) {
      throw new Error(
        `Agent orchestration failed: ${orchestrationResult.error?.message}`
      );
    }

    const result = orchestrationResult.data;

    // Store application in database (agent already created temp ID)
    const application = await this.prisma.application.create({
      data: {
        id: result.applicationId,
        userId,
        jobId: request.jobId,
        status: ApplicationStatus.Found,
      },
    });

    // Store decision log with V1 data
    await this.prisma.decisionLog.create({
      data: {
        applicationId: application.id,
        personaLabel: result.decision.persona,
        realityIndex: result.decision.realityIndex,
        signalsJson: result.decision.signals,
        keywordsEmphasized: result.decision.keywordsEmphasized,
        // TODO: Add V1 fields when Prisma client is regenerated
        // switchesJson: result.decision.switches,
        // provenanceLinksJson: result.decision.provenanceLinks,
      },
    });

    // Store document records
    for (const doc of result.docs) {
      await this.prisma.applicationDoc.create({
        data: {
          applicationId: application.id,
          kind: doc.kind as DocumentKind,
          format: doc.format as DocumentFormat,
          blobUri: doc.uri,
          variantLabel: doc.variantLabel,
          language: doc.language,
        },
      });
    }

    return {
      applicationId: result.applicationId,
      docs: result.docs.map((doc) => ({
        kind: doc.kind as DocumentKind,
        format: doc.format as DocumentFormat,
        uri: doc.uri,
        variantLabel: doc.variantLabel,
        language: doc.language,
      })),
      decision: {
        persona: result.decision.persona,
        realityIndex: result.decision.realityIndex,
        signals: result.decision.signals,
        keywordsEmphasized: result.decision.keywordsEmphasized,
        styleRationale: result.decision.styleRationale,
        switches: result.decision.switches,
        provenanceLinks: result.decision.provenanceLinks,
      },
    };
  }

  /**
   * Regenerate application with modified switches (V1)
   */
  async regenerateApplication(
    userId: string,
    applicationId: string,
    switches: Array<{ label: string; active: boolean }>,
    realityIndex?: number,
    stylePreference?: "concise" | "balanced" | "detailed"
  ): Promise<ApplicationGenerateResponseDto> {
    // Verify application ownership
    const application = await this.prisma.application.findFirst({
      where: { id: applicationId, userId },
      include: { job: true },
    });

    if (!application) {
      throw new Error("Application not found");
    }

    // Get CV data
    const cvPreview = await this.cvService.getCvPreview(userId);
    const jobDetail = await this.jobsService.getJob(application.jobId);

    // Build agent context
    const context: AgentContext = {
      userId,
      jobId: application.jobId,
      applicationId,
      cvFacts: cvPreview,
      jobDetail,
    };

    // Execute regeneration
    const orchestrationResult =
      await this.agentOrchestrator.regenerateWithSwitches(
        context,
        applicationId,
        switches,
        realityIndex,
        stylePreference
      );

    if (!orchestrationResult.success) {
      throw new Error(
        `Regeneration failed: ${orchestrationResult.error?.message}`
      );
    }

    const result = orchestrationResult.data;

    // Update decision log
    await this.prisma.decisionLog.create({
      data: {
        applicationId: applicationId,
        personaLabel: result.decision.persona,
        realityIndex: result.decision.realityIndex,
        signalsJson: result.decision.signals,
        keywordsEmphasized: result.decision.keywordsEmphasized,
        // TODO: Add V1 fields when Prisma client is regenerated
        // styleRationale: result.decision.styleRationale,
        // switchesJson: result.decision.switches,
        // provenanceLinksJson: result.decision.provenanceLinks,
      },
    });

    return {
      applicationId: result.applicationId,
      docs: result.docs.map((doc) => ({
        kind: doc.kind as DocumentKind,
        format: doc.format as DocumentFormat,
        uri: doc.uri,
        variantLabel: doc.variantLabel,
        language: doc.language,
      })),
      decision: {
        persona: result.decision.persona,
        realityIndex: result.decision.realityIndex,
        signals: result.decision.signals,
        keywordsEmphasized: result.decision.keywordsEmphasized,
        styleRationale: result.decision.styleRationale,
        switches: result.decision.switches,
        provenanceLinks: result.decision.provenanceLinks,
      },
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
              location: true,
            },
          },
          notes: {
            select: { id: true },
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
      nextReminderAt: undefined, // TODO: Add reminder query
      hasNotes: app.notes.length > 0,
      coachingHint: undefined, // TODO: Add coaching hint
      location: app.job.location,
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
      reminders: [], // TODO: Add reminders query
      history: { entries: [] }, // TODO: Add history query
      coachingHints: { hints: [] }, // TODO: Add coaching hints
      createdAt: application.createdAt.toISOString(),
      updatedAt: application.updatedAt.toISOString(),
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
            location: true,
          },
        },
        notes: {
          select: { id: true },
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
      nextReminderAt: undefined, // TODO: Add reminder query
      hasNotes: updatedApp.notes.length > 0,
      coachingHint: undefined, // TODO: Add coaching hint
      location: updatedApp.job.location,
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

  // V2 Methods

  async updateNote(
    userId: string,
    applicationId: string,
    noteId: string,
    text: string
  ): Promise<NoteDto> {
    // Verify application belongs to user
    const application = await this.prisma.application.findFirst({
      where: { id: applicationId, userId },
    });

    if (!application) {
      throw new Error("Application not found");
    }

    const note = await this.prisma.note.update({
      where: { id: noteId, applicationId },
      data: { text },
    });

    return {
      id: note.id,
      text: note.text,
      createdAt: note.createdAt.toISOString(),
    };
  }

  async deleteNote(
    userId: string,
    applicationId: string,
    noteId: string
  ): Promise<void> {
    // Verify application belongs to user
    const application = await this.prisma.application.findFirst({
      where: { id: applicationId, userId },
    });

    if (!application) {
      throw new Error("Application not found");
    }

    await this.prisma.note.delete({
      where: { id: noteId, applicationId },
    });
  }

  async setReminder(
    userId: string,
    applicationId: string,
    reminderData: ReminderCreateDto
  ): Promise<ReminderDto> {
    // Verify application belongs to user
    const application = await this.prisma.application.findFirst({
      where: { id: applicationId, userId },
    });

    if (!application) {
      throw new Error("Application not found");
    }

    // For now, create a mock reminder since we're skipping DB changes
    const mockReminder: ReminderDto = {
      id: `reminder-${Date.now()}`,
      applicationId,
      dueAt: reminderData.dueAt,
      kind: reminderData.kind,
      title: reminderData.title,
      description: reminderData.description,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    return mockReminder;
  }

  async getApplicationReminders(
    userId: string,
    applicationId: string
  ): Promise<ReminderDto[]> {
    // Verify application belongs to user
    const application = await this.prisma.application.findFirst({
      where: { id: applicationId, userId },
    });

    if (!application) {
      throw new Error("Application not found");
    }

    // Return empty for now since we're skipping DB changes
    return [];
  }

  async getUpcomingReminders(
    userId: string,
    limit: number = 10
  ): Promise<ReminderWithApplicationDto[]> {
    // Return empty for now since we're skipping DB changes
    return [];
  }

  async completeReminder(
    userId: string,
    reminderId: string
  ): Promise<ReminderDto> {
    // Mock implementation for now
    const mockReminder: ReminderDto = {
      id: reminderId,
      applicationId: `app-${Date.now()}`,
      dueAt: new Date().toISOString(),
      kind: "followup",
      completed: true,
      completedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    return mockReminder;
  }

  async deleteApplication(
    userId: string,
    applicationId: string
  ): Promise<void> {
    // Verify application belongs to user
    const application = await this.prisma.application.findFirst({
      where: { id: applicationId, userId },
    });

    if (!application) {
      throw new Error("Application not found");
    }

    // Delete application (cascade deletes will handle related records)
    await this.prisma.application.delete({
      where: { id: applicationId },
    });
  }

  async exportApplications(
    userId: string,
    filters: {
      status?: ApplicationStatus;
      company?: string;
      search?: string;
    }
  ): Promise<ApplicationSummaryDto[]> {
    const where: any = { userId };

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.company) {
      where.job = {
        company: { contains: filters.company, mode: "insensitive" },
      };
    }

    if (filters.search) {
      where.OR = [
        { job: { company: { contains: filters.search, mode: "insensitive" } } },
        { job: { title: { contains: filters.search, mode: "insensitive" } } },
        { notesMd: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const applications = await this.prisma.application.findMany({
      where,
      include: {
        job: {
          select: {
            company: true,
            title: true,
            location: true,
          },
        },
        notes: {
          select: { id: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return applications.map((app) => ({
      id: app.id,
      company: app.job.company,
      title: app.job.title,
      status: app.status as ApplicationStatus,
      createdAt: app.createdAt.toISOString(),
      appliedAt: app.appliedAt?.toISOString(),
      nextReminderAt: undefined,
      hasNotes: app.notes.length > 0,
      coachingHint: undefined,
      location: app.job.location,
    }));
  }

  async getApplicationCoachingHints(
    userId: string,
    applicationId: string
  ): Promise<CoachingHintsDto> {
    // Verify application belongs to user
    const application = await this.prisma.application.findFirst({
      where: { id: applicationId, userId },
    });

    if (!application) {
      throw new Error("Application not found");
    }

    // Mock implementation for now
    return {
      hints: [
        {
          id: "hint-1",
          category: "next_step",
          title: "Follow up with hiring manager",
          description:
            "It's been 5 days since you applied. Consider sending a follow-up email.",
          priority: "medium",
          dismissed: false,
        },
      ],
      nextStepHint: "Follow up in 2-3 days if no response",
    };
  }

  async dismissCoachingHint(
    userId: string,
    applicationId: string,
    hintId: string
  ): Promise<void> {
    // Verify application belongs to user
    const application = await this.prisma.application.findFirst({
      where: { id: applicationId, userId },
    });

    if (!application) {
      throw new Error("Application not found");
    }

    // Mock implementation for now - would update coaching_hints table
    console.log(`Dismissed hint ${hintId} for application ${applicationId}`);
  }
}
