/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CoachingCompanionResponse = {
    /**
     * Motivational advice for interview prep
     */
    motivationalAdvice: string;
    /**
     * Specific practice suggestion
     */
    practiceSuggestion: string;
    /**
     * Tips based on feedback logs
     */
    feedbackBasedTips: Array<string>;
    /**
     * Areas where more STAR stories are needed
     */
    starStoryGaps: Array<string>;
    lastUpdated: string;
    applicationId: string;
};

