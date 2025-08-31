/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DocumentFormat } from './DocumentFormat';
import type { DocumentKind } from './DocumentKind';
export type GeneratedDoc = {
    kind: DocumentKind;
    format: DocumentFormat;
    uri: string;
    /**
     * e.g., concise | balanced | detailed
     */
    variantLabel?: string;
    language?: string;
};

