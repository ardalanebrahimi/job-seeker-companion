import {
  IsString,
  IsOptional,
  IsUrl,
  IsUUID,
  IsEnum,
  IsInt,
  Min,
  Max,
  IsArray,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ExperienceItemDto {
  @ApiPropertyOptional()
  company?: string;

  @ApiPropertyOptional()
  title?: string;

  @ApiPropertyOptional()
  startDate?: string;

  @ApiPropertyOptional()
  endDate?: string;

  @ApiPropertyOptional({ type: [String] })
  bullets?: string[];
}

export class EducationItemDto {
  @ApiPropertyOptional()
  institution?: string;

  @ApiPropertyOptional()
  degree?: string;

  @ApiPropertyOptional()
  year?: string;
}

export class CvPreviewDto {
  @ApiPropertyOptional()
  summary?: string;

  @ApiPropertyOptional({ type: [String] })
  skills?: string[];

  @ApiPropertyOptional({ type: [ExperienceItemDto] })
  experience?: ExperienceItemDto[];

  @ApiPropertyOptional({ type: [EducationItemDto] })
  education?: EducationItemDto[];

  @ApiPropertyOptional()
  fileUri?: string;
}

export class CvUploadDto {
  @ApiProperty({ type: "string", format: "binary" })
  file: any;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  filename?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  language?: string;
}

export class CvUploadResponseDto {
  @ApiProperty()
  fileId: string;

  @ApiProperty()
  parsed: boolean;

  @ApiPropertyOptional()
  language?: string;

  @ApiPropertyOptional()
  preview?: CvPreviewDto;
}

export class ErrorDto {
  @ApiProperty()
  error: {
    code: string;
    message: string;
  };
}

// Job DTOs
export class JobIngestRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  rawText?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  language?: string;
}

export class JobIngestResponseDto {
  @ApiProperty()
  @IsUUID()
  jobId: string;
}

export class JdStructDto {
  @ApiPropertyOptional({ type: [String] })
  skills?: string[];

  @ApiPropertyOptional({ type: [String] })
  requirements?: string[];

  @ApiPropertyOptional({ type: [String] })
  niceToHave?: string[];

  @ApiPropertyOptional()
  seniority?: string;
}

export class JobDetailDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  company?: string;

  @ApiPropertyOptional()
  title?: string;

  @ApiPropertyOptional()
  location?: string;

  @ApiProperty()
  jdText: string;

  @ApiPropertyOptional()
  jdStruct?: JdStructDto;

  @ApiProperty()
  firstSeenAt: string;
}

// Application DTOs
export enum ApplicationStatus {
  Found = "Found",
  Applied = "Applied",
  Interview = "Interview",
  Offer = "Offer",
  Rejected = "Rejected",
}

export enum DocumentKind {
  cv = "cv",
  cover = "cover",
  brochure = "brochure",
  prep = "prep",
}

export enum DocumentFormat {
  md = "md",
  docx = "docx",
  pdf = "pdf",
}

export class ApplicationGenerateRequestDto {
  @ApiProperty()
  @IsUUID()
  jobId: string;

  @ApiPropertyOptional({
    minimum: 0,
    maximum: 2,
    description: "Reality Index (V1)",
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(2)
  realityIndex?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({ description: "Optional persona override (V1)" })
  @IsOptional()
  @IsString()
  personaHint?: string;

  @ApiPropertyOptional({
    enum: ["concise", "balanced", "detailed"],
    description: "Optional style preference (V1)",
  })
  @IsOptional()
  @IsEnum(["concise", "balanced", "detailed"])
  stylePreference?: "concise" | "balanced" | "detailed";
}

export class GeneratedDocDto {
  @ApiProperty({ enum: DocumentKind })
  @IsEnum(DocumentKind)
  kind: DocumentKind;

  @ApiProperty({ enum: DocumentFormat })
  @IsEnum(DocumentFormat)
  format: DocumentFormat;

  @ApiProperty()
  @IsString()
  uri: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  variantLabel?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  language?: string;
}

export class DecisionDto {
  @ApiPropertyOptional({ description: "Auto-decided persona (V1)" })
  persona?: string;

  @ApiPropertyOptional({ description: "Applied Reality Index (V1)" })
  realityIndex?: number;

  @ApiPropertyOptional({
    type: [String],
    description: "Top signals for persona choice (V1)",
  })
  signals?: string[];

  @ApiPropertyOptional({
    type: [String],
    description: "JD keywords emphasized (V1)",
  })
  keywordsEmphasized?: string[];

  @ApiPropertyOptional({ description: "Style choice rationale (V1)" })
  styleRationale?: string;

  @ApiPropertyOptional({
    type: "array",
    items: {
      type: "object",
      properties: {
        label: { type: "string" },
        active: { type: "boolean" },
      },
    },
    description: "Available emphasis switches (V1)",
  })
  switches?: Array<{ label: string; active: boolean }>;

  @ApiPropertyOptional({
    type: "array",
    items: {
      type: "object",
      properties: {
        claimText: { type: "string" },
        sourceFactId: { type: "string" },
        factType: { type: "string" },
      },
    },
    description: "Claim provenance links (V1)",
  })
  provenanceLinks?: Array<{
    claimText: string;
    sourceFactId: string;
    factType: string;
  }>;
}

export class ApplicationGenerateResponseDto {
  @ApiProperty()
  applicationId: string;

  @ApiProperty({ type: [GeneratedDocDto] })
  docs: GeneratedDocDto[];

  @ApiPropertyOptional()
  decision?: DecisionDto;
}

export class ApplicationSummaryDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  company?: string;

  @ApiPropertyOptional()
  title?: string;

  @ApiProperty({ enum: ApplicationStatus })
  status: ApplicationStatus;

  @ApiProperty()
  createdAt: string;

  @ApiPropertyOptional()
  appliedAt?: string;
}

export class ApplicationListDto {
  @ApiProperty({ type: [ApplicationSummaryDto] })
  items: ApplicationSummaryDto[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  total: number;
}

export class NoteDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  text: string;

  @ApiProperty()
  createdAt: string;
}

export class NoteCreateDto {
  @ApiProperty()
  @IsString()
  text: string;
}

export class ApplicationDetailDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  job?: JobDetailDto;

  @ApiProperty({ enum: ApplicationStatus })
  status: ApplicationStatus;

  @ApiPropertyOptional({ type: [NoteDto] })
  notes?: NoteDto[];

  @ApiPropertyOptional({ type: [GeneratedDocDto] })
  docs?: GeneratedDocDto[];

  @ApiPropertyOptional()
  decision?: DecisionDto;
}

export class StatusUpdateDto {
  @ApiProperty({ enum: ApplicationStatus })
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;
}

// Coach DTOs
export class GapActionDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  etaDays: number;
}

export class GapRoadmapDto {
  @ApiProperty()
  matchScore: number;

  @ApiProperty({ type: [String] })
  mustHaveGaps: string[];

  @ApiProperty({ type: [String] })
  niceToHaveGaps: string[];

  @ApiProperty({ type: [GapActionDto] })
  actions: GapActionDto[];
}

export class CoachingNudgeDto {
  @ApiProperty({ enum: ["emphasize", "trim", "gap", "improvement"] })
  category: "emphasize" | "trim" | "gap" | "improvement";

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: ["high", "medium", "low"] })
  priority: "high" | "medium" | "low";
}

export class ImmediateActionDto {
  @ApiProperty()
  action: string;

  @ApiProperty()
  etaDays: number;
}

export class CoachingNudgesDto {
  @ApiProperty({
    type: [CoachingNudgeDto],
    description: "3-5 actionable coaching tips (V1)",
  })
  nudges: CoachingNudgeDto[];

  @ApiProperty({
    type: [ImmediateActionDto],
    description: "Things to address this week",
  })
  immediateActions: ImmediateActionDto[];

  @ApiProperty({
    type: [String],
    description: "Key themes from JD that advice references",
  })
  jdThemes: string[];
}
