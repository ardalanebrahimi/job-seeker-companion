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
};

