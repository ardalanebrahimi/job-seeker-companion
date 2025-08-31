/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ApplicationHistory = {
    entries: Array<{
        id: string;
        timestamp: string;
        type: 'status_change' | 'note_added' | 'note_updated' | 'note_deleted' | 'reminder_set' | 'reminder_completed' | 'document_generated';
        description: string;
        metadata?: Record<string, any>;
    }>;
};

