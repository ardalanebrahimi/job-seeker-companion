/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CvPreview = {
    summary?: string;
    skills?: Array<string>;
    experience?: Array<{
        company?: string;
        title?: string;
        startDate?: string;
        endDate?: string | null;
        bullets?: Array<string>;
    }>;
    education?: Array<{
        institution?: string;
        degree?: string;
        year?: string;
    }>;
    fileUri?: string;
};

