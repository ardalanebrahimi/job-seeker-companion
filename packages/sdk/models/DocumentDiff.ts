/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type DocumentDiff = {
    documentId: string;
    changes: Array<{
        type: 'added' | 'removed' | 'modified';
        /**
         * Section name (e.g., "Experience", "Skills")
         */
        section: string;
        originalText?: string | null;
        modifiedText?: string | null;
        /**
         * Why this change was made
         */
        reason?: string;
        /**
         * Reference to source fact in resume
         */
        sourceFact?: string;
    }>;
    summary: {
        addedCount: number;
        removedCount: number;
        modifiedCount: number;
        keyChanges: Array<string>;
    };
};

