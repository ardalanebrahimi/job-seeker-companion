/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DocumentFormat } from './DocumentFormat';
export type VariantGenerateRequest = {
    variants: Array<'concise' | 'balanced' | 'detailed'>;
    regenerateExisting?: boolean;
    targetFormat?: DocumentFormat;
};

