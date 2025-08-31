/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Reminder = {
    id: string;
    applicationId: string;
    dueAt: string;
    kind: Reminder.kind;
    title?: string;
    description?: string;
    completed: boolean;
    completedAt?: string | null;
    createdAt: string;
};
export namespace Reminder {
    export enum kind {
        FOLLOWUP = 'followup',
        INTERVIEW = 'interview',
        TASK = 'task',
    }
}

