import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException,
  Req,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CoachService } from "./coach.service";
import { GapRoadmapDto, ErrorDto, CoachingNudgesDto } from "../common/dto";
import { IsUUID, IsOptional, IsString } from "class-validator";

class GapRoadmapRequestDto {
  @IsUUID()
  jobId: string;

  @IsOptional()
  @IsString()
  personaHint?: string;
}

class CoachingNudgesRequestDto {
  @IsUUID()
  jobId: string;

  @IsOptional()
  @IsUUID()
  applicationId?: string;
}

@ApiTags("Coach")
@Controller("coach")
export class CoachController {
  constructor(private coachService: CoachService) {}

  @Post("nudges")
  @ApiOperation({
    summary: "Get coaching nudges for a specific job application (V1)",
    operationId: "getCoachingNudges",
  })
  @ApiResponse({
    status: 200,
    description: "Coaching nudges and actionable tips",
    type: CoachingNudgesDto,
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
  async getCoachingNudges(
    @Body() request: CoachingNudgesRequestDto,
    @Req() req: any
  ): Promise<CoachingNudgesDto> {
    try {
      const result = await this.coachService.getCoachingNudges(
        req.userId,
        request.jobId,
        request.applicationId
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
            code: "COACHING_FAILED",
            message: error.message || "Failed to generate coaching nudges",
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post("gap-roadmap")
  @ApiOperation({
    summary: "Generate gap analysis and short roadmap for a job",
    operationId: "generateGapRoadmap",
  })
  @ApiResponse({
    status: 200,
    description: "Gap analysis and roadmap",
    type: GapRoadmapDto,
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
  async generateGapRoadmap(
    @Body() request: GapRoadmapRequestDto,
    @Req() req: any
  ): Promise<GapRoadmapDto> {
    try {
      const result = await this.coachService.generateGapRoadmap(
        req.userId,
        request.jobId,
        request.personaHint
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
            code: "ANALYSIS_FAILED",
            message: error.message || "Failed to generate gap analysis",
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
