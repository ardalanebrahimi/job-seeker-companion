/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type GapRoadmap = {
    matchScore?: number;
    mustHaveGaps?: Array<string>;
    niceToHaveGaps?: Array<string>;
    /**
     * Actionable steps or micro-projects
     */
    actions?: Array<{
        title?: string;
        description?: string;
        etaDays?: number;
    }>;
};

