/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type InterviewFeedback = {
    id: string;
    applicationId: string;
    interviewDate: string;
    /**
     * Who provided the feedback
     */
    feedbackSource?: string;
    /**
     * Detailed feedback
     */
    feedback: string;
    areasForImprovement?: Array<string>;
    positivePoints?: Array<string>;
    createdAt: string;
};

