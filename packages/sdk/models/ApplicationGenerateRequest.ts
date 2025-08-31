/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ApplicationGenerateRequest = {
    jobId: string;
    /**
     * Optional override; default decided by agent (V1)
     */
    realityIndex?: number;
    /**
     * Output language; defaults to JD language
     */
    language?: string;
    /**
     * Optional persona override; agent auto-decides if not provided (V1)
     */
    personaHint?: string;
    /**
     * Optional style preference; agent auto-decides if not provided (V1)
     */
    stylePreference?: ApplicationGenerateRequest.stylePreference;
};
export namespace ApplicationGenerateRequest {
    /**
     * Optional style preference; agent auto-decides if not provided (V1)
     */
    export enum stylePreference {
        CONCISE = 'concise',
        BALANCED = 'balanced',
        DETAILED = 'detailed',
    }
}

