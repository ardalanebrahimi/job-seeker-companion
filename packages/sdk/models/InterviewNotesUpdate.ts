/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type InterviewNotesUpdate = {
    interviewDate?: string;
    interviewerName?: string | null;
    interviewType?: InterviewNotesUpdate.interviewType;
    /**
     * Duration in minutes
     */
    duration?: number | null;
    /**
     * Detailed interview notes
     */
    notes?: string;
    rating?: number | null;
    nextSteps?: string | null;
};
export namespace InterviewNotesUpdate {
    export enum interviewType {
        PHONE = 'phone',
        VIDEO = 'video',
        IN_PERSON = 'in-person',
        PANEL = 'panel',
    }
}

