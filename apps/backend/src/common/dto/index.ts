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

  @ApiPropertyOptional({ minimum: 0, maximum: 2 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(2)
  realityIndex?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  language?: string;
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
  @ApiPropertyOptional()
  persona?: string;

  @ApiPropertyOptional()
  realityIndex?: number;

  @ApiPropertyOptional({ type: [String] })
  signals?: string[];

  @ApiPropertyOptional({ type: [String] })
  keywordsEmphasized?: string[];
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
