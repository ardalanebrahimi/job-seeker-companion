import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpException,
  Req,
  ParseIntPipe,
  DefaultValuePipe,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";
import { ApplicationsService } from "./applications.service";
import {
  ApplicationGenerateRequestDto,
  ApplicationGenerateResponseDto,
  ApplicationListDto,
  ApplicationDetailDto,
  ApplicationStatus,
  NoteCreateDto,
  NoteDto,
  StatusUpdateDto,
  ApplicationSummaryDto,
  ReminderCreateDto,
  ReminderDto,
  ReminderWithApplicationDto,
  CoachingHintsDto,
  ErrorDto,
} from "../common/dto";

@ApiTags("Applications")
@Controller("applications")
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @Post("generate")
  @ApiOperation({
    summary:
      "Generate tailored CV & cover letter for a job (auto persona + RI)",
    operationId: "generateApplicationDocuments",
  })
  @ApiResponse({
    status: 201,
    description: "Application created with generated documents",
    type: ApplicationGenerateResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
    type: ErrorDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
    type: ErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: "Not found",
    type: ErrorDto,
  })
  async generateApplication(
    @Body() request: ApplicationGenerateRequestDto,
    @Req() req: any
  ): Promise<ApplicationGenerateResponseDto> {
    try {
      const result = await this.applicationsService.generateApplication(
        req.userId,
        request
      );
      return result;
    } catch (error) {
      if (error.message?.includes("not found")) {
        throw new HttpException(
          {
            error: {
              code: "RESOURCE_NOT_FOUND",
              message: error.message,
            },
          },
          HttpStatus.NOT_FOUND
        );
      }

      throw new HttpException(
        {
          error: {
            code: "GENERATION_FAILED",
            message:
              error.message || "Failed to generate application documents",
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post(":id/regenerate")
  @ApiOperation({
    summary: "Regenerate application docs with modified switches/settings (V1)",
    operationId: "regenerateApplicationDocuments",
  })
  @ApiResponse({
    status: 200,
    description: "Application regenerated with new settings",
    type: ApplicationGenerateResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
    type: ErrorDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
    type: ErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: "Not found",
    type: ErrorDto,
  })
  async regenerateApplication(
    @Param("id") applicationId: string,
    @Body()
    request: {
      switches?: Array<{ label: string; active: boolean }>;
      realityIndex?: number;
      stylePreference?: "concise" | "balanced" | "detailed";
    },
    @Req() req: any
  ): Promise<ApplicationGenerateResponseDto> {
    try {
      const result = await this.applicationsService.regenerateApplication(
        req.userId,
        applicationId,
        request.switches || [],
        request.realityIndex,
        request.stylePreference
      );
      return result;
    } catch (error) {
      if (error.message?.includes("not found")) {
        throw new HttpException(
          {
            error: {
              code: "RESOURCE_NOT_FOUND",
              message: error.message,
            },
          },
          HttpStatus.NOT_FOUND
        );
      }

      throw new HttpException(
        {
          error: {
            code: "REGENERATION_FAILED",
            message:
              error.message || "Failed to regenerate application documents",
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get()
  @ApiOperation({
    summary: "List applications with filtering and search (V2)",
    operationId: "listApplications",
  })
  @ApiQuery({ name: "page", type: "integer", required: false })
  @ApiQuery({ name: "pageSize", type: "integer", required: false })
  @ApiQuery({ name: "status", enum: ApplicationStatus, required: false })
  @ApiQuery({ name: "company", type: "string", required: false })
  @ApiQuery({
    name: "search",
    type: "string",
    required: false,
    description: "Search in company, title, and notes",
  })
  @ApiQuery({
    name: "sortBy",
    enum: ["createdAt", "appliedAt", "status", "company"],
    required: false,
  })
  @ApiQuery({ name: "sortOrder", enum: ["asc", "desc"], required: false })
  @ApiResponse({
    status: 200,
    description: "List of applications",
    type: ApplicationListDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
    type: ErrorDto,
  })
  async listApplications(
    @Req() req: any,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query("pageSize", new DefaultValuePipe(20), ParseIntPipe) pageSize = 20,
    @Query("status") status?: ApplicationStatus,
    @Query("company") company?: string,
    @Query("search") search?: string,
    @Query("sortBy", new DefaultValuePipe("createdAt")) sortBy = "createdAt",
    @Query("sortOrder", new DefaultValuePipe("desc")) sortOrder = "desc"
  ): Promise<ApplicationListDto> {
    try {
      const result = await this.applicationsService.listApplications(
        req.userId,
        status,
        page,
        pageSize
      );
      return result;
    } catch (error) {
      throw new HttpException(
        {
          error: {
            code: "FETCH_FAILED",
            message: "Failed to fetch applications",
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get application detail (docs + decisions)",
    operationId: "getApplicationDetail",
  })
  @ApiResponse({
    status: 200,
    description: "Application detail",
    type: ApplicationDetailDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
    type: ErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: "Not found",
    type: ErrorDto,
  })
  async getApplicationDetail(
    @Param("id") id: string,
    @Req() req: any
  ): Promise<ApplicationDetailDto> {
    try {
      const result = await this.applicationsService.getApplicationDetail(
        req.userId,
        id
      );
      return result;
    } catch (error) {
      if (error.message?.includes("not found")) {
        throw new HttpException(
          {
            error: {
              code: "APPLICATION_NOT_FOUND",
              message: "Application not found",
            },
          },
          HttpStatus.NOT_FOUND
        );
      }

      throw new HttpException(
        {
          error: {
            code: "FETCH_FAILED",
            message: "Failed to fetch application detail",
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post(":id/notes")
  @ApiOperation({
    summary: "Add a note to an application",
    operationId: "addApplicationNote",
  })
  @ApiResponse({
    status: 201,
    description: "Note stored",
    type: NoteDto,
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
    type: ErrorDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
    type: ErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: "Not found",
    type: ErrorDto,
  })
  async addApplicationNote(
    @Param("id") id: string,
    @Body() noteData: NoteCreateDto,
    @Req() req: any
  ): Promise<NoteDto> {
    try {
      const result = await this.applicationsService.addNote(
        req.userId,
        id,
        noteData.text
      );
      return result;
    } catch (error) {
      if (error.message?.includes("not found")) {
        throw new HttpException(
          {
            error: {
              code: "APPLICATION_NOT_FOUND",
              message: "Application not found",
            },
          },
          HttpStatus.NOT_FOUND
        );
      }

      throw new HttpException(
        {
          error: {
            code: "NOTE_CREATION_FAILED",
            message: "Failed to create note",
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post(":id/status")
  @ApiOperation({
    summary: "Update application status",
    operationId: "updateApplicationStatus",
  })
  @ApiResponse({
    status: 200,
    description: "Status updated",
    type: ApplicationSummaryDto,
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
    type: ErrorDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
    type: ErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: "Not found",
    type: ErrorDto,
  })
  async updateApplicationStatus(
    @Param("id") id: string,
    @Body() statusUpdate: StatusUpdateDto,
    @Req() req: any
  ): Promise<ApplicationSummaryDto> {
    try {
      const result = await this.applicationsService.updateStatus(
        req.userId,
        id,
        statusUpdate.status
      );
      return result;
    } catch (error) {
      if (error.message?.includes("not found")) {
        throw new HttpException(
          {
            error: {
              code: "APPLICATION_NOT_FOUND",
              message: "Application not found",
            },
          },
          HttpStatus.NOT_FOUND
        );
      }

      throw new HttpException(
        {
          error: {
            code: "STATUS_UPDATE_FAILED",
            message: "Failed to update status",
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // V2 Endpoints

  @Put(":id/notes/:noteId")
  @ApiOperation({
    summary: "Update a note on an application (V2)",
    operationId: "updateApplicationNote",
  })
  async updateApplicationNote(
    @Req() req: any,
    @Param("id") applicationId: string,
    @Param("noteId") noteId: string,
    @Body() body: NoteCreateDto
  ): Promise<NoteDto> {
    try {
      return await this.applicationsService.updateNote(
        req.userId,
        applicationId,
        noteId,
        body.text
      );
    } catch (error) {
      throw new HttpException(
        {
          error: {
            code: "NOTE_UPDATE_FAILED",
            message: "Failed to update note",
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(":id/notes/:noteId")
  @ApiOperation({
    summary: "Delete a note from an application (V2)",
    operationId: "deleteApplicationNote",
  })
  @ApiResponse({ status: 204, description: "Note deleted" })
  async deleteApplicationNote(
    @Req() req: any,
    @Param("id") applicationId: string,
    @Param("noteId") noteId: string
  ): Promise<void> {
    try {
      await this.applicationsService.deleteNote(
        req.userId,
        applicationId,
        noteId
      );
    } catch (error) {
      throw new HttpException(
        {
          error: {
            code: "NOTE_DELETE_FAILED",
            message: "Failed to delete note",
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post(":id/reminders")
  @ApiOperation({
    summary: "Set a reminder for an application (V2)",
    operationId: "setApplicationReminder",
  })
  async setApplicationReminder(
    @Req() req: any,
    @Param("id") applicationId: string,
    @Body() body: ReminderCreateDto
  ): Promise<ReminderDto> {
    try {
      return await this.applicationsService.setReminder(
        req.userId,
        applicationId,
        body
      );
    } catch (error) {
      throw new HttpException(
        {
          error: {
            code: "REMINDER_SET_FAILED",
            message: "Failed to set reminder",
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(":id/reminders")
  @ApiOperation({
    summary: "Get reminders for an application (V2)",
    operationId: "getApplicationReminders",
  })
  async getApplicationReminders(
    @Req() req: any,
    @Param("id") applicationId: string
  ): Promise<ReminderDto[]> {
    try {
      return await this.applicationsService.getApplicationReminders(
        req.userId,
        applicationId
      );
    } catch (error) {
      throw new HttpException(
        {
          error: {
            code: "REMINDERS_FETCH_FAILED",
            message: "Failed to fetch reminders",
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(":id/delete")
  @ApiOperation({
    summary: "Delete an application and all linked documents (V2)",
    operationId: "deleteApplication",
  })
  @ApiResponse({ status: 204, description: "Application deleted" })
  async deleteApplication(
    @Req() req: any,
    @Param("id") applicationId: string
  ): Promise<void> {
    try {
      await this.applicationsService.deleteApplication(
        req.userId,
        applicationId
      );
    } catch (error) {
      throw new HttpException(
        {
          error: {
            code: "APPLICATION_DELETE_FAILED",
            message: "Failed to delete application",
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("export")
  @ApiOperation({
    summary: "Export applications list (V2)",
    operationId: "exportApplications",
  })
  @ApiQuery({ name: "format", enum: ["csv", "json"], required: false })
  @ApiQuery({ name: "status", enum: ApplicationStatus, required: false })
  @ApiQuery({ name: "company", type: "string", required: false })
  @ApiQuery({ name: "search", type: "string", required: false })
  async exportApplications(
    @Req() req: any,
    @Query("format", new DefaultValuePipe("csv")) format = "csv",
    @Query("status") status?: ApplicationStatus,
    @Query("company") company?: string,
    @Query("search") search?: string
  ): Promise<ApplicationSummaryDto[]> {
    try {
      return await this.applicationsService.exportApplications(req.userId, {
        status,
        company,
        search,
      });
    } catch (error) {
      throw new HttpException(
        {
          error: {
            code: "EXPORT_FAILED",
            message: "Failed to export applications",
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

@ApiTags("Applications")
@Controller("reminders")
export class RemindersController {
  constructor(private applicationsService: ApplicationsService) {}

  @Get()
  @ApiOperation({
    summary: "Get upcoming reminders across all applications (V2)",
    operationId: "getUpcomingReminders",
  })
  @ApiQuery({ name: "limit", type: "integer", required: false })
  async getUpcomingReminders(
    @Req() req: any,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit = 10
  ): Promise<ReminderWithApplicationDto[]> {
    try {
      return await this.applicationsService.getUpcomingReminders(
        req.userId,
        limit
      );
    } catch (error) {
      throw new HttpException(
        {
          error: {
            code: "REMINDERS_FETCH_FAILED",
            message: "Failed to fetch reminders",
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post(":id/complete")
  @ApiOperation({
    summary: "Mark a reminder as completed (V2)",
    operationId: "completeReminder",
  })
  async completeReminder(
    @Req() req: any,
    @Param("id") reminderId: string
  ): Promise<ReminderDto> {
    try {
      return await this.applicationsService.completeReminder(
        req.userId,
        reminderId
      );
    } catch (error) {
      throw new HttpException(
        {
          error: {
            code: "REMINDER_COMPLETE_FAILED",
            message: "Failed to complete reminder",
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

@ApiTags("Coach")
@Controller("coach")
export class CoachController {
  constructor(private applicationsService: ApplicationsService) {}

  @Get("hints/:applicationId")
  @ApiOperation({
    summary: "Get coaching hints for an application (V2)",
    operationId: "getApplicationCoachingHints",
  })
  async getApplicationCoachingHints(
    @Req() req: any,
    @Param("applicationId") applicationId: string
  ): Promise<CoachingHintsDto> {
    try {
      return await this.applicationsService.getApplicationCoachingHints(
        req.userId,
        applicationId
      );
    } catch (error) {
      throw new HttpException(
        {
          error: {
            code: "HINTS_FETCH_FAILED",
            message: "Failed to fetch coaching hints",
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post("hints/:applicationId/dismiss")
  @ApiOperation({
    summary: "Dismiss a coaching hint for an application (V2)",
    operationId: "dismissCoachingHint",
  })
  @ApiResponse({ status: 204, description: "Hint dismissed" })
  async dismissCoachingHint(
    @Req() req: any,
    @Param("applicationId") applicationId: string,
    @Body() body: { hintId: string }
  ): Promise<void> {
    try {
      await this.applicationsService.dismissCoachingHint(
        req.userId,
        applicationId,
        body.hintId
      );
    } catch (error) {
      throw new HttpException(
        {
          error: {
            code: "HINT_DISMISS_FAILED",
            message: "Failed to dismiss hint",
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // V3 - Document Variants and Management
  @Post(":id/variants")
  @ApiOperation({
    summary: "Generate multiple document variants for an application (V3)",
    operationId: "generateDocumentVariants",
  })
  @ApiResponse({
    status: 201,
    description: "Document variants generated",
  })
  async generateDocumentVariants(
    @Req() req: any,
    @Param("id") applicationId: string,
    @Body()
    body: {
      variants: string[];
      regenerateExisting?: boolean;
      targetFormat?: string;
    }
  ): Promise<any> {
    try {
      return await this.applicationsService.generateDocumentVariants(
        req.userId,
        applicationId,
        body.variants,
        body.targetFormat as any
      );
    } catch (error) {
      throw new HttpException(
        {
          error: {
            code: "VARIANT_GENERATION_FAILED",
            message: error.message || "Failed to generate document variants",
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(":id/documents/:documentId/preview")
  @ApiOperation({
    summary: "Preview a document in the browser (V3)",
    operationId: "previewDocument",
  })
  @ApiResponse({
    status: 200,
    description: "Document preview",
    content: {
      "text/html": {
        schema: { type: "string" },
      },
    },
  })
  async previewDocument(
    @Req() req: any,
    @Param("id") applicationId: string,
    @Param("documentId") documentId: string
  ): Promise<string> {
    try {
      return await this.applicationsService.previewDocument(
        req.userId,
        applicationId,
        documentId
      );
    } catch (error) {
      throw new HttpException(
        {
          error: {
            code: "PREVIEW_FAILED",
            message: error.message || "Failed to preview document",
          },
        },
        HttpStatus.NOT_FOUND
      );
    }
  }

  @Get(":id/documents/:documentId/download")
  @ApiOperation({
    summary: "Download a document file (V3)",
    operationId: "downloadDocument",
  })
  @ApiResponse({
    status: 200,
    description: "Document file",
  })
  async downloadDocument(
    @Req() req: any,
    @Param("id") applicationId: string,
    @Param("documentId") documentId: string
  ): Promise<any> {
    try {
      return await this.applicationsService.downloadDocument(
        req.userId,
        applicationId,
        documentId
      );
    } catch (error) {
      throw new HttpException(
        {
          error: {
            code: "DOWNLOAD_FAILED",
            message: error.message || "Failed to download document",
          },
        },
        HttpStatus.NOT_FOUND
      );
    }
  }

  @Get(":id/documents/:documentId/diff")
  @ApiOperation({
    summary: "Get diff between generated document and base CV (V3)",
    operationId: "getDocumentDiff",
  })
  @ApiResponse({
    status: 200,
    description: "Document diff",
  })
  async getDocumentDiff(
    @Req() req: any,
    @Param("id") applicationId: string,
    @Param("documentId") documentId: string
  ): Promise<any> {
    try {
      return await this.applicationsService.getDocumentDiff(
        req.userId,
        applicationId,
        documentId
      );
    } catch (error) {
      throw new HttpException(
        {
          error: {
            code: "DIFF_FAILED",
            message: error.message || "Failed to generate document diff",
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(":id/documents/history")
  @ApiOperation({
    summary: "Get document history with versions (V3)",
    operationId: "getDocumentHistory",
  })
  @ApiResponse({
    status: 200,
    description: "Document history",
  })
  async getDocumentHistory(
    @Req() req: any,
    @Param("id") applicationId: string
  ): Promise<any> {
    try {
      return await this.applicationsService.getDocumentHistory(
        req.userId,
        applicationId
      );
    } catch (error) {
      throw new HttpException(
        {
          error: {
            code: "HISTORY_FETCH_FAILED",
            message: error.message || "Failed to fetch document history",
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // V4 Endpoints - Company Brochure & Interview Hub
  @Get(":id/company/snapshot")
  @ApiOperation({
    summary: "Get company snapshot for application",
    operationId: "getApplicationCompanySnapshot",
  })
  @ApiResponse({
    status: 200,
    description: "Company snapshot for this application",
  })
  async getApplicationCompanySnapshot(@Param("id") id: string) {
    try {
      return await this.applicationsService.getApplicationCompanySnapshot(id);
    } catch (error) {
      throw new HttpException(
        {
          error: {
            code: "SNAPSHOT_FETCH_FAILED",
            message: error.message || "Failed to fetch company snapshot",
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(":id/fit-brief")
  @ApiOperation({
    summary: "Get role-specific fit brief",
    operationId: "getRoleSpecificFitBrief",
  })
  @ApiResponse({
    status: 200,
    description: "Role-specific fit brief",
  })
  async getRoleSpecificFitBrief(@Param("id") id: string) {
    try {
      return await this.applicationsService.getRoleSpecificFitBrief(id);
    } catch (error) {
      throw new HttpException(
        {
          error: {
            code: "FIT_BRIEF_FAILED",
            message: error.message || "Failed to generate fit brief",
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(":id/interview-prep")
  @ApiOperation({
    summary: "Get interview prep pack",
    operationId: "getInterviewPrepPack",
  })
  @ApiResponse({
    status: 200,
    description: "Interview prep pack",
  })
  async getInterviewPrepPack(@Param("id") id: string) {
    try {
      return await this.applicationsService.getInterviewPrepPack(id);
    } catch (error) {
      throw new HttpException(
        {
          error: {
            code: "PREP_PACK_FAILED",
            message: error.message || "Failed to generate interview prep pack",
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(":id/star-stories")
  @ApiOperation({
    summary: "Generate STAR stories for behavioral questions",
    operationId: "generateStarStories",
  })
  @ApiResponse({
    status: 200,
    description: "Generated STAR stories",
  })
  async generateStarStories(@Param("id") id: string) {
    try {
      return await this.applicationsService.generateStarStories(id);
    } catch (error) {
      throw new HttpException(
        {
          error: {
            code: "STAR_STORIES_FAILED",
            message: error.message || "Failed to generate STAR stories",
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(":id/likely-questions")
  @ApiOperation({
    summary: "Get likely interview questions",
    operationId: "getLikelyQuestions",
  })
  @ApiResponse({
    status: 200,
    description: "Likely interview questions",
  })
  async getLikelyQuestions(@Param("id") id: string) {
    try {
      return await this.applicationsService.getLikelyQuestions(id);
    } catch (error) {
      throw new HttpException(
        {
          error: {
            code: "QUESTIONS_FAILED",
            message: error.message || "Failed to generate likely questions",
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(":id/interview-notes")
  @ApiOperation({
    summary: "Get interview notes for application",
    operationId: "getInterviewNotes",
  })
  @ApiResponse({
    status: 200,
    description: "Interview notes",
  })
  async getInterviewNotes(@Param("id") id: string) {
    try {
      return await this.applicationsService.getInterviewNotes(id);
    } catch (error) {
      throw new HttpException(
        {
          error: {
            code: "NOTES_FETCH_FAILED",
            message: error.message || "Failed to fetch interview notes",
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post(":id/interview-notes")
  @ApiOperation({
    summary: "Add interview notes",
    operationId: "addInterviewNotes",
  })
  @ApiResponse({
    status: 201,
    description: "Interview notes added",
  })
  async addInterviewNotes(@Param("id") id: string, @Body() createDto: any) {
    try {
      return await this.applicationsService.addInterviewNotes(id, createDto);
    } catch (error) {
      throw new HttpException(
        {
          error: {
            code: "NOTES_CREATE_FAILED",
            message: error.message || "Failed to add interview notes",
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(":id/interview-notes/:noteId")
  @ApiOperation({
    summary: "Update interview notes",
    operationId: "updateInterviewNotes",
  })
  @ApiResponse({
    status: 200,
    description: "Interview notes updated",
  })
  async updateInterviewNotes(
    @Param("id") id: string,
    @Param("noteId") noteId: string,
    @Body() updateDto: any
  ) {
    try {
      return await this.applicationsService.updateInterviewNotes(
        id,
        noteId,
        updateDto
      );
    } catch (error) {
      throw new HttpException(
        {
          error: {
            code: "NOTES_UPDATE_FAILED",
            message: error.message || "Failed to update interview notes",
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(":id/feedback")
  @ApiOperation({
    summary: "Get interview feedback log",
    operationId: "getInterviewFeedback",
  })
  @ApiResponse({
    status: 200,
    description: "Interview feedback log",
  })
  async getInterviewFeedback(@Param("id") id: string) {
    try {
      return await this.applicationsService.getInterviewFeedback(id);
    } catch (error) {
      throw new HttpException(
        {
          error: {
            code: "FEEDBACK_FETCH_FAILED",
            message: error.message || "Failed to fetch interview feedback",
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post(":id/feedback")
  @ApiOperation({
    summary: "Add interview feedback",
    operationId: "addInterviewFeedback",
  })
  @ApiResponse({
    status: 201,
    description: "Interview feedback added",
  })
  async addInterviewFeedback(@Param("id") id: string, @Body() createDto: any) {
    try {
      return await this.applicationsService.addInterviewFeedback(id, createDto);
    } catch (error) {
      throw new HttpException(
        {
          error: {
            code: "FEEDBACK_CREATE_FAILED",
            message: error.message || "Failed to add interview feedback",
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post(":id/thank-you-email")
  @ApiOperation({
    summary: "Generate thank-you email after interview",
    operationId: "generateThankYouEmail",
  })
  @ApiResponse({
    status: 200,
    description: "Generated thank-you email",
  })
  async generateThankYouEmail(
    @Param("id") id: string,
    @Body() requestDto: any
  ) {
    try {
      return await this.applicationsService.generateThankYouEmail(
        id,
        requestDto
      );
    } catch (error) {
      throw new HttpException(
        {
          error: {
            code: "EMAIL_GENERATION_FAILED",
            message: error.message || "Failed to generate thank-you email",
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(":id/coaching-companion")
  @ApiOperation({
    summary: "Get coaching companion suggestions for interview hub",
    operationId: "getCoachingCompanion",
  })
  @ApiResponse({
    status: 200,
    description: "Coaching companion suggestions",
  })
  async getCoachingCompanion(@Param("id") id: string) {
    try {
      return await this.applicationsService.getCoachingCompanion(id);
    } catch (error) {
      throw new HttpException(
        {
          error: {
            code: "COACHING_FAILED",
            message: error.message || "Failed to get coaching suggestions",
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
