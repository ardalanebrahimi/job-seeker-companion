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

  @ApiPropertyOptional()
  nextReminderAt?: string;

  @ApiProperty()
  hasNotes: boolean;

  @ApiPropertyOptional()
  coachingHint?: string;

  @ApiPropertyOptional()
  location?: string;
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

// --- V2 DTOs ---

export class DuplicateCheckResponseDto {
  @ApiProperty()
  isDuplicate: boolean;

  @ApiProperty()
  similarityScore: number;

  @ApiPropertyOptional()
  existingJobId?: string;

  @ApiPropertyOptional()
  existingApplicationId?: string;

  @ApiPropertyOptional()
  reason?: string;

  @ApiProperty()
  canOverride: boolean;
}

export class ReminderCreateDto {
  @ApiProperty()
  @IsString()
  dueAt: string;

  @ApiProperty({ enum: ["followup", "interview", "task"] })
  @IsEnum(["followup", "interview", "task"])
  kind: "followup" | "interview" | "task";

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}

export class ReminderDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  applicationId: string;

  @ApiProperty()
  dueAt: string;

  @ApiProperty({ enum: ["followup", "interview", "task"] })
  kind: "followup" | "interview" | "task";

  @ApiPropertyOptional()
  title?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  completed: boolean;

  @ApiPropertyOptional()
  completedAt?: string;

  @ApiProperty()
  createdAt: string;
}

export class ReminderWithApplicationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  applicationId: string;

  @ApiProperty()
  dueAt: string;

  @ApiProperty({ enum: ["followup", "interview", "task"] })
  kind: "followup" | "interview" | "task";

  @ApiPropertyOptional()
  title?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  completed: boolean;

  @ApiProperty()
  application: {
    id: string;
    company?: string;
    title?: string;
    status: ApplicationStatus;
  };
}

export class CoachingHintDto {
  @ApiProperty()
  id: string;

  @ApiProperty({
    enum: ["next_step", "follow_up", "improvement", "preparation"],
  })
  category: "next_step" | "follow_up" | "improvement" | "preparation";

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: ["high", "medium", "low"] })
  priority: "high" | "medium" | "low";

  @ApiProperty()
  dismissed: boolean;
}

export class CoachingHintsDto {
  @ApiProperty({ type: [CoachingHintDto] })
  hints: CoachingHintDto[];

  @ApiPropertyOptional()
  nextStepHint?: string;
}

export class ApplicationHistoryEntryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  timestamp: string;

  @ApiProperty({
    enum: [
      "status_change",
      "note_added",
      "note_updated",
      "note_deleted",
      "reminder_set",
      "reminder_completed",
      "document_generated",
    ],
  })
  type:
    | "status_change"
    | "note_added"
    | "note_updated"
    | "note_deleted"
    | "reminder_set"
    | "reminder_completed"
    | "document_generated";

  @ApiProperty()
  description: string;

  @ApiPropertyOptional()
  metadata?: Record<string, any>;
}

export class ApplicationHistoryDto {
  @ApiProperty({ type: [ApplicationHistoryEntryDto] })
  entries: ApplicationHistoryEntryDto[];
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

  @ApiPropertyOptional({ type: [ReminderDto] })
  reminders?: ReminderDto[];

  @ApiPropertyOptional()
  history?: ApplicationHistoryDto;

  @ApiPropertyOptional()
  coachingHints?: CoachingHintsDto;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
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
