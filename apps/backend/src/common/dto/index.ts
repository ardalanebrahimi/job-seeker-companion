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

// V3 - Document Variants and Management DTOs

export class VariantGenerateRequestDto {
  @ApiProperty({
    type: [String],
    enum: ["concise", "balanced", "detailed"],
    default: ["concise", "detailed"],
  })
  variants: string[];

  @ApiProperty({ default: false })
  regenerateExisting?: boolean;

  @ApiProperty({ enum: DocumentFormat, default: DocumentFormat.docx })
  targetFormat?: DocumentFormat;
}

export class EnhancedGeneratedDocDto extends GeneratedDocDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  version: number;

  @ApiProperty()
  createdAt: string;

  @ApiProperty({ enum: ["modern", "minimal", "classic"] })
  templateStyle: string;

  @ApiProperty({ required: false })
  coachingNote?: string;

  @ApiProperty()
  previewUrl: string;

  @ApiProperty()
  downloadUrl: string;
}

export class GeneratedVariantDto {
  @ApiProperty({ enum: ["concise", "balanced", "detailed"] })
  variantLabel: string;

  @ApiProperty({ type: [EnhancedGeneratedDocDto] })
  documents: EnhancedGeneratedDocDto[];

  @ApiProperty()
  coachingNote: string;
}

export class VariantGenerateResponseDto {
  @ApiProperty({ type: [GeneratedVariantDto] })
  variants: GeneratedVariantDto[];

  @ApiProperty({ enum: ["concise", "balanced", "detailed"] })
  recommendedVariant: string;
}

export class DocumentDiffChangeDto {
  @ApiProperty({ enum: ["added", "removed", "modified"] })
  type: "added" | "removed" | "modified";

  @ApiProperty()
  section: string;

  @ApiProperty({ required: false })
  originalText?: string;

  @ApiProperty({ required: false })
  modifiedText?: string;

  @ApiProperty()
  reason: string;

  @ApiProperty()
  sourceFact: string;
}

export class DocumentDiffSummaryDto {
  @ApiProperty()
  addedCount: number;

  @ApiProperty()
  removedCount: number;

  @ApiProperty()
  modifiedCount: number;

  @ApiProperty({ type: [String] })
  keyChanges: string[];
}

export class DocumentDiffDto {
  @ApiProperty()
  documentId: string;

  @ApiProperty({ type: [DocumentDiffChangeDto] })
  changes: DocumentDiffChangeDto[];

  @ApiProperty({ type: DocumentDiffSummaryDto })
  summary: DocumentDiffSummaryDto;
}

export class DocumentHistoryItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: DocumentKind })
  kind: DocumentKind;

  @ApiProperty({ enum: DocumentFormat })
  format: DocumentFormat;

  @ApiProperty({ required: false })
  variantLabel?: string;

  @ApiProperty()
  version: number;

  @ApiProperty()
  uri: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  isCurrent: boolean;
}

export class DocumentHistoryDto {
  @ApiProperty()
  applicationId: string;

  @ApiProperty({ type: [DocumentHistoryItemDto] })
  documents: DocumentHistoryItemDto[];
}

// V4 DTOs - Company Brochure & Interview Hub
export class CompanyNewsItemDto {
  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  url?: string;

  @ApiProperty()
  date: string;

  @ApiProperty()
  summary: string;
}

export class CompanySnapshotDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  logo?: string;

  @ApiPropertyOptional()
  website?: string;

  @ApiProperty()
  industry: string;

  @ApiPropertyOptional()
  size?: string;

  @ApiPropertyOptional()
  headquarters?: string;

  @ApiProperty()
  summary: string;

  @ApiProperty({ type: [CompanyNewsItemDto] })
  recentNews: CompanyNewsItemDto[];

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class CompanyBrochureSectionDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiPropertyOptional({ type: [String] })
  images?: string[];

  @ApiPropertyOptional({ type: [String] })
  competitors?: string[];

  @ApiPropertyOptional({ type: [String] })
  values?: string[];
}

export class CompanyTimelineItemDto {
  @ApiProperty()
  year: number;

  @ApiProperty()
  event: string;

  @ApiPropertyOptional()
  description?: string;
}

export class CompanyBrochureSectionsDto {
  @ApiPropertyOptional()
  products?: CompanyBrochureSectionDto;

  @ApiPropertyOptional()
  market?: CompanyBrochureSectionDto;

  @ApiPropertyOptional()
  culture?: CompanyBrochureSectionDto;

  @ApiPropertyOptional({ type: [CompanyTimelineItemDto] })
  timeline?: CompanyTimelineItemDto[];
}

export class CompanyBrochureDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  companyId: string;

  @ApiProperty()
  snapshot: CompanySnapshotDto;

  @ApiProperty()
  sections: CompanyBrochureSectionsDto;

  @ApiPropertyOptional()
  exportUrl?: string;

  @ApiProperty()
  createdAt: string;
}

export class FitReasonDto {
  @ApiProperty()
  reason: string;

  @ApiProperty()
  evidence: string;

  @ApiProperty({ enum: ["high", "medium", "low"] })
  strength: "high" | "medium" | "low";
}

export class SkillAlignmentDto {
  @ApiProperty()
  skill: string;

  @ApiProperty()
  userExperience: string;

  @ApiProperty()
  companyNeed: string;

  @ApiProperty({ minimum: 0, maximum: 1 })
  matchScore: number;
}

export class RoleSpecificFitBriefDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  applicationId: string;

  @ApiProperty({ type: [FitReasonDto] })
  fitReasons: FitReasonDto[];

  @ApiProperty({ type: [SkillAlignmentDto] })
  skillAlignments: SkillAlignmentDto[];

  @ApiPropertyOptional({ default: "coaching" })
  tone?: string;

  @ApiProperty()
  createdAt: string;
}

export class StarStoryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  situation: string;

  @ApiProperty()
  task: string;

  @ApiProperty()
  action: string;

  @ApiProperty()
  result: string;

  @ApiProperty({ minimum: 0, maximum: 2 })
  realityIndex: number;

  @ApiPropertyOptional({ default: true })
  isEditable?: boolean;

  @ApiProperty()
  createdAt: string;
}

export class StarStoriesResponseDto {
  @ApiProperty({ type: [StarStoryDto] })
  stories: StarStoryDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  applicationId: string;
}

export class InterviewQuestionDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  question: string;

  @ApiProperty({ enum: ["role-specific", "company-specific", "behavioral"] })
  category: "role-specific" | "company-specific" | "behavioral";

  @ApiProperty({ enum: ["easy", "medium", "hard"] })
  difficulty: "easy" | "medium" | "hard";

  @ApiPropertyOptional()
  linkedStoryId?: string;

  @ApiPropertyOptional({ type: [String] })
  tips?: string[];
}

export class LikelyQuestionsResponseDto {
  @ApiProperty({ type: [InterviewQuestionDto] })
  questions: InterviewQuestionDto[];

  @ApiProperty()
  applicationId: string;

  @ApiProperty()
  generatedAt: string;
}

export class InterviewPrepPackDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  applicationId: string;

  @ApiProperty()
  companySnapshot: CompanySnapshotDto;

  @ApiProperty()
  fitBrief: RoleSpecificFitBriefDto;

  @ApiProperty({ type: [StarStoryDto] })
  starStories: StarStoryDto[];

  @ApiProperty({ type: [InterviewQuestionDto] })
  likelyQuestions: InterviewQuestionDto[];

  @ApiPropertyOptional()
  exportUrl?: string;

  @ApiProperty()
  createdAt: string;
}

export class InterviewNotesCreateDto {
  @ApiProperty()
  interviewDate: string;

  @ApiPropertyOptional()
  interviewerName?: string;

  @ApiProperty({ enum: ["phone", "video", "in-person", "panel"] })
  interviewType: "phone" | "video" | "in-person" | "panel";

  @ApiPropertyOptional()
  duration?: number;

  @ApiProperty()
  notes: string;

  @ApiPropertyOptional({ minimum: 1, maximum: 5 })
  rating?: number;

  @ApiPropertyOptional()
  nextSteps?: string;
}

export class InterviewNotesUpdateDto {
  @ApiPropertyOptional()
  interviewDate?: string;

  @ApiPropertyOptional()
  interviewerName?: string;

  @ApiPropertyOptional({ enum: ["phone", "video", "in-person", "panel"] })
  interviewType?: "phone" | "video" | "in-person" | "panel";

  @ApiPropertyOptional()
  duration?: number;

  @ApiPropertyOptional()
  notes?: string;

  @ApiPropertyOptional({ minimum: 1, maximum: 5 })
  rating?: number;

  @ApiPropertyOptional()
  nextSteps?: string;
}

export class InterviewNotesDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  applicationId: string;

  @ApiProperty()
  interviewDate: string;

  @ApiPropertyOptional()
  interviewerName?: string;

  @ApiProperty({ enum: ["phone", "video", "in-person", "panel"] })
  interviewType: "phone" | "video" | "in-person" | "panel";

  @ApiPropertyOptional()
  duration?: number;

  @ApiProperty()
  notes: string;

  @ApiPropertyOptional({ minimum: 1, maximum: 5 })
  rating?: number;

  @ApiPropertyOptional()
  nextSteps?: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class InterviewNotesResponseDto {
  @ApiProperty({ type: [InterviewNotesDto] })
  notes: InterviewNotesDto[];

  @ApiProperty()
  applicationId: string;

  @ApiProperty()
  total: number;
}

export class InterviewFeedbackCreateDto {
  @ApiProperty()
  interviewDate: string;

  @ApiPropertyOptional()
  feedbackSource?: string;

  @ApiProperty()
  feedback: string;

  @ApiPropertyOptional({ type: [String] })
  areasForImprovement?: string[];

  @ApiPropertyOptional({ type: [String] })
  positivePoints?: string[];
}

export class InterviewFeedbackDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  applicationId: string;

  @ApiProperty()
  interviewDate: string;

  @ApiPropertyOptional()
  feedbackSource?: string;

  @ApiProperty()
  feedback: string;

  @ApiPropertyOptional({ type: [String] })
  areasForImprovement?: string[];

  @ApiPropertyOptional({ type: [String] })
  positivePoints?: string[];

  @ApiProperty()
  createdAt: string;
}

export class InterviewFeedbackResponseDto {
  @ApiProperty({ type: [InterviewFeedbackDto] })
  feedback: InterviewFeedbackDto[];

  @ApiProperty()
  applicationId: string;

  @ApiProperty()
  total: number;
}

export class ThankYouEmailRequestDto {
  @ApiPropertyOptional()
  interviewerName?: string;

  @ApiProperty()
  interviewDate: string;

  @ApiProperty({ enum: ["phone", "video", "in-person", "panel"] })
  interviewType: "phone" | "video" | "in-person" | "panel";

  @ApiPropertyOptional({ type: [String] })
  keyDiscussionPoints?: string[];

  @ApiPropertyOptional()
  personalNote?: string;
}

export class ThankYouEmailResponseDto {
  @ApiProperty()
  subject: string;

  @ApiProperty()
  body: string;

  @ApiPropertyOptional()
  recipientName?: string;

  @ApiProperty()
  generatedAt: string;
}

export class CoachingCompanionResponseDto {
  @ApiProperty()
  motivationalAdvice: string;

  @ApiProperty()
  practiceSuggestion: string;

  @ApiProperty({ type: [String] })
  feedbackBasedTips: string[];

  @ApiProperty({ type: [String] })
  starStoryGaps: string[];

  @ApiProperty()
  lastUpdated: string;

  @ApiProperty()
  applicationId: string;
}

// Export type aliases for backward compatibility
export type CompanySnapshot = CompanySnapshotDto;
export type CompanyBrochure = CompanyBrochureDto;
export type RoleSpecificFitBrief = RoleSpecificFitBriefDto;
export type InterviewPrepPack = InterviewPrepPackDto;
export type StarStoriesResponse = StarStoriesResponseDto;
export type LikelyQuestionsResponse = LikelyQuestionsResponseDto;
export type InterviewNotesResponse = InterviewNotesResponseDto;
export type InterviewFeedbackResponse = InterviewFeedbackResponseDto;
export type ThankYouEmailRequest = ThankYouEmailRequestDto;
export type ThankYouEmailResponse = ThankYouEmailResponseDto;
export type CoachingCompanionResponse = CoachingCompanionResponseDto;
