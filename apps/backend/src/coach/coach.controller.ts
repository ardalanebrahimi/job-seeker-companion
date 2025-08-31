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
import { GapRoadmapDto, ErrorDto } from "../common/dto";
import { IsUUID, IsOptional, IsString } from "class-validator";

class GapRoadmapRequestDto {
  @IsUUID()
  jobId: string;

  @IsOptional()
  @IsString()
  personaHint?: string;
}

@ApiTags("Coach")
@Controller("coach")
export class CoachController {
  constructor(private coachService: CoachService) {}

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
