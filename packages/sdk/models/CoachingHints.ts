/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CoachingHints = {
    hints: Array<{
        id: string;
        category: 'next_step' | 'follow_up' | 'improvement' | 'preparation';
        title: string;
        description: string;
        priority: 'high' | 'medium' | 'low';
        dismissed: boolean;
    }>;
    /**
     * Primary next step recommendation
     */
    nextStepHint?: string | null;
};

