/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CompanyBrochure } from '../models/CompanyBrochure';
import type { CompanySnapshot } from '../models/CompanySnapshot';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ResearchService {
    /**
     * Get company snapshot (basic card)
     * @returns CompanySnapshot Company snapshot
     * @throws ApiError
     */
    public static getCompanySnapshot({
        id,
    }: {
        id: string,
    }): CancelablePromise<CompanySnapshot> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/companies/{id}/snapshot',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                404: `Not found`,
            },
        });
    }
    /**
     * Get multimedia company brochure
     * @returns CompanyBrochure Company brochure
     * @throws ApiError
     */
    public static getCompanyBrochure({
        id,
    }: {
        id: string,
    }): CancelablePromise<CompanyBrochure> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/companies/{id}/brochure',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                404: `Not found`,
            },
        });
    }
}
