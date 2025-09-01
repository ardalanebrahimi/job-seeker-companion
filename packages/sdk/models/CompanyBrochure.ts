/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CompanySnapshot } from './CompanySnapshot';
export type CompanyBrochure = {
    id: string;
    companyId: string;
    snapshot: CompanySnapshot;
    sections: {
        products?: {
            title?: string;
            content?: string;
            images?: Array<string>;
        };
        market?: {
            title?: string;
            content?: string;
            competitors?: Array<string>;
        };
        culture?: {
            title?: string;
            content?: string;
            values?: Array<string>;
        };
        timeline?: Array<{
            year: number;
            event: string;
            description?: string;
        }>;
    };
    /**
     * URL to export as PDF
     */
    exportUrl?: string;
    createdAt: string;
};

