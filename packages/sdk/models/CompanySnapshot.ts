/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CompanySnapshot = {
    id: string;
    /**
     * Company name
     */
    name: string;
    /**
     * URL to company logo
     */
    logo?: string;
    /**
     * Company website URL
     */
    website?: string;
    /**
     * Industry category
     */
    industry: string;
    /**
     * Company size (e.g., "50-200 employees")
     */
    size?: string;
    /**
     * HQ location
     */
    headquarters?: string;
    /**
     * 2-3 sentence summary of products/services
     */
    summary: string;
    recentNews?: Array<{
        title: string;
        url?: string;
        date: string;
        summary: string;
    }>;
    createdAt: string;
    updatedAt: string;
};

