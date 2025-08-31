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
}
