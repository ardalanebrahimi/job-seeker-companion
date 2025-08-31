/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApplicationStatus } from './ApplicationStatus';
export type ReminderWithApplication = {
    id: string;
    applicationId: string;
    dueAt: string;
    kind: ReminderWithApplication.kind;
    title?: string;
    description?: string;
    completed: boolean;
    application: {
        id: string;
        company?: string;
        title?: string;
        status: ApplicationStatus;
    };
};
export namespace ReminderWithApplication {
    export enum kind {
        FOLLOWUP = 'followup',
        INTERVIEW = 'interview',
        TASK = 'task',
    }
}

