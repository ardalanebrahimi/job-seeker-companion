/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ReminderCreate = {
    dueAt: string;
    kind: ReminderCreate.kind;
    title?: string;
    description?: string;
};
export namespace ReminderCreate {
    export enum kind {
        FOLLOWUP = 'followup',
        INTERVIEW = 'interview',
        TASK = 'task',
    }
}

