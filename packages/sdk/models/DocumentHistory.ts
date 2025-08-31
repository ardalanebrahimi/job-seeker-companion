/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DocumentFormat } from './DocumentFormat';
import type { DocumentKind } from './DocumentKind';
export type DocumentHistory = {
    applicationId: string;
    documents: Array<{
        id: string;
        kind: DocumentKind;
        format: DocumentFormat;
        variantLabel?: string | null;
        version: number;
        uri: string;
        createdAt: string;
        /**
         * Whether this is the current version for this variant
         */
        isCurrent: boolean;
    }>;
};

