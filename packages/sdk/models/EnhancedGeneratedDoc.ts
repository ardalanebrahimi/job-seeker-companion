/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GeneratedDoc } from './GeneratedDoc';
export type EnhancedGeneratedDoc = (GeneratedDoc & {
    id: string;
    version: number;
    createdAt: string;
    templateStyle: EnhancedGeneratedDoc.templateStyle;
    coachingNote?: string | null;
    /**
     * URL for browser preview
     */
    previewUrl?: string;
    /**
     * URL for file download
     */
    downloadUrl?: string;
});
export namespace EnhancedGeneratedDoc {
    export enum templateStyle {
        MODERN = 'modern',
        MINIMAL = 'minimal',
        CLASSIC = 'classic',
    }
}

