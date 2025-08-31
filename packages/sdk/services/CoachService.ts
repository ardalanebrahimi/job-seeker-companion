/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GapRoadmap } from '../models/GapRoadmap';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CoachService {
    /**
     * Generate gap analysis and short roadmap for a job
     * @returns GapRoadmap Gap analysis and roadmap
     * @throws ApiError
     */
    public static generateGapRoadmap({
        requestBody,
    }: {
        requestBody: {
            jobId: string;
            /**
             * Optional persona label override
             */
            personaHint?: string;
        },
    }): CancelablePromise<GapRoadmap> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/coach/gap-roadmap',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                404: `Not found`,
            },
        });
    }
}
