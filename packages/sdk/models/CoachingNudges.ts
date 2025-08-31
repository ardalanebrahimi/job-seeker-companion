/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CoachingNudges = {
    /**
     * 3-5 actionable coaching tips specific to this JD (V1)
     */
    nudges?: Array<{
        category?: 'emphasize' | 'trim' | 'gap' | 'improvement';
        title?: string;
        description?: string;
        priority?: 'high' | 'medium' | 'low';
    }>;
    /**
     * Things to address this week
     */
    immediateActions?: Array<{
        action?: string;
        etaDays?: number;
    }>;
    /**
     * Key themes from JD that advice references
     */
    jdThemes?: Array<string>;
};

