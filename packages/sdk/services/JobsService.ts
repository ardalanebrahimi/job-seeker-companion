/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JobDetail } from '../models/JobDetail';
import type { JobIngestRequest } from '../models/JobIngestRequest';
import type { JobIngestResponse } from '../models/JobIngestResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class JobsService {
    /**
     * Ingest a job from URL or raw text
     * @returns JobIngestResponse Job ingested
     * @throws ApiError
     */
    public static ingestJob({
        requestBody,
    }: {
        requestBody: JobIngestRequest,
    }): CancelablePromise<JobIngestResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/jobs/ingest',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Get job details and basic analysis
     * @returns JobDetail Job with JD text and extracted structure
     * @throws ApiError
     */
    public static getJob({
        id,
    }: {
        id: string,
    }): CancelablePromise<JobDetail> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/jobs/{id}',
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
