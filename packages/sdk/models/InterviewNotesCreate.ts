/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type InterviewNotesCreate = {
    interviewDate: string;
    interviewerName?: string | null;
    interviewType: InterviewNotesCreate.interviewType;
    /**
     * Duration in minutes
     */
    duration?: number | null;
    /**
     * Detailed interview notes
     */
    notes: string;
    rating?: number | null;
    nextSteps?: string | null;
};
export namespace InterviewNotesCreate {
    export enum interviewType {
        PHONE = 'phone',
        VIDEO = 'video',
        IN_PERSON = 'in-person',
        PANEL = 'panel',
    }
}

