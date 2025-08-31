import {
  Controller,
  Get,
  Post,
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
    summary: "List applications (summary)",
    operationId: "listApplications",
  })
  @ApiQuery({ name: "status", enum: ApplicationStatus, required: false })
  @ApiQuery({ name: "page", type: "integer", required: false })
  @ApiQuery({ name: "pageSize", type: "integer", required: false })
  @ApiResponse({
    status: 200,
    description: "Paged application summaries",
    type: ApplicationListDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
    type: ErrorDto,
  })
  async listApplications(
    @Req() req: any,
    @Query("status") status?: ApplicationStatus,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query("pageSize", new DefaultValuePipe(20), ParseIntPipe) pageSize = 20
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
}
