/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GeneratedDoc } from './GeneratedDoc';
export type VariantGenerateResponse = {
    variants: Array<{
        variantLabel: 'concise' | 'balanced' | 'detailed';
        documents: Array<GeneratedDoc>;
        /**
         * Short advice on when to use this variant
         */
        coachingNote?: string;
    }>;
    /**
     * Agent's recommendation for this specific job
     */
    recommendedVariant?: VariantGenerateResponse.recommendedVariant;
};
export namespace VariantGenerateResponse {
    /**
     * Agent's recommendation for this specific job
     */
    export enum recommendedVariant {
        CONCISE = 'concise',
        BALANCED = 'balanced',
        DETAILED = 'detailed',
    }
}

