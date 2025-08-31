/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type DuplicateCheckResponse = {
    isDuplicate: boolean;
    /**
     * Similarity score (0-1)
     */
    similarityScore?: number;
    existingJobId?: string | null;
    existingApplicationId?: string | null;
    /**
     * Explanation of why it's considered a duplicate
     */
    reason?: string;
    /**
     * Whether user can override and save as new
     */
    canOverride: boolean;
};

