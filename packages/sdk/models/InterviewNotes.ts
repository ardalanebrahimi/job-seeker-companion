/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type InterviewNotes = {
    id: string;
    applicationId: string;
    interviewDate: string;
    interviewerName?: string | null;
    interviewType: InterviewNotes.interviewType;
    /**
     * Duration in minutes
     */
    duration?: number | null;
    /**
     * Detailed interview notes
     */
    notes: string;
    /**
     * Self-assessment rating
     */
    rating?: number | null;
    /**
     * Mentioned next steps
     */
    nextSteps?: string | null;
    createdAt: string;
    updatedAt: string;
};
export namespace InterviewNotes {
    export enum interviewType {
        PHONE = 'phone',
        VIDEO = 'video',
        IN_PERSON = 'in-person',
        PANEL = 'panel',
    }
}

