import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpStatus,
  HttpException,
  Req,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { JobsService } from "./jobs.service";
import {
  JobIngestRequestDto,
  JobIngestResponseDto,
  JobDetailDto,
  ErrorDto,
} from "../common/dto";

@ApiTags("Jobs")
@Controller("jobs")
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Post("ingest")
  @ApiOperation({
    summary: "Ingest a job from URL or raw text",
    operationId: "ingestJob",
  })
  @ApiResponse({
    status: 201,
    description: "Job ingested",
    type: JobIngestResponseDto,
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
  async ingestJob(
    @Body() request: JobIngestRequestDto,
    @Req() req: any
  ): Promise<JobIngestResponseDto> {
    try {
      // Validate that either url or rawText is provided
      if (!request.url && !request.rawText) {
        throw new HttpException(
          {
            error: {
              code: "INVALID_REQUEST",
              message: "Either url or rawText must be provided",
            },
          },
          HttpStatus.BAD_REQUEST
        );
      }

      const result = await this.jobsService.ingestJob(request);
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          error: {
            code: "INGEST_FAILED",
            message: error.message || "Failed to ingest job",
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get job details and basic analysis",
    operationId: "getJob",
  })
  @ApiResponse({
    status: 200,
    description: "Job with JD text and extracted structure",
    type: JobDetailDto,
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
  async getJob(@Param("id") id: string): Promise<JobDetailDto> {
    try {
      const job = await this.jobsService.getJob(id);
      return job;
    } catch (error) {
      if (error.message?.includes("not found")) {
        throw new HttpException(
          {
            error: {
              code: "JOB_NOT_FOUND",
              message: "Job not found",
            },
          },
          HttpStatus.NOT_FOUND
        );
      }

      throw new HttpException(
        {
          error: {
            code: "FETCH_FAILED",
            message: "Failed to fetch job",
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
