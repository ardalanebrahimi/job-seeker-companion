/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApplicationStatus } from './ApplicationStatus';
export type ApplicationSummary = {
    id: string;
    company?: string;
    title?: string;
    status: ApplicationStatus;
    createdAt: string;
    appliedAt?: string | null;
    /**
     * Next upcoming reminder date (V2)
     */
    nextReminderAt?: string | null;
    /**
     * Whether this application has notes (V2)
     */
    hasNotes: boolean;
    /**
     * Primary coaching hint for tracker view (V2)
     */
    coachingHint?: string | null;
    /**
     * Job location (V2)
     */
    location?: string | null;
};

