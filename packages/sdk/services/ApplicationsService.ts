/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApplicationDetail } from '../models/ApplicationDetail';
import type { ApplicationGenerateRequest } from '../models/ApplicationGenerateRequest';
import type { ApplicationGenerateResponse } from '../models/ApplicationGenerateResponse';
import type { ApplicationList } from '../models/ApplicationList';
import type { ApplicationStatus } from '../models/ApplicationStatus';
import type { ApplicationSummary } from '../models/ApplicationSummary';
import type { Note } from '../models/Note';
import type { NoteCreate } from '../models/NoteCreate';
import type { StatusUpdate } from '../models/StatusUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ApplicationsService {
    /**
     * List applications (summary)
     * @returns ApplicationList Paged application summaries
     * @throws ApiError
     */
    public static listApplications({
        status,
        page = 1,
        pageSize = 20,
    }: {
        status?: ApplicationStatus,
        page?: number,
        pageSize?: number,
    }): CancelablePromise<ApplicationList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/applications',
            query: {
                'status': status,
                'page': page,
                'pageSize': pageSize,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Generate tailored CV & cover letter for a job (auto persona + RI)
     * @returns ApplicationGenerateResponse Application created with generated documents
     * @throws ApiError
     */
    public static generateApplicationDocuments({
        requestBody,
    }: {
        requestBody: ApplicationGenerateRequest,
    }): CancelablePromise<ApplicationGenerateResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/applications/generate',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                404: `Not found`,
            },
        });
    }
    /**
     * Get application detail (docs + decisions)
     * @returns ApplicationDetail Application detail
     * @throws ApiError
     */
    public static getApplicationDetail({
        id,
    }: {
        id: string,
    }): CancelablePromise<ApplicationDetail> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/applications/{id}',
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
     * Add a note to an application
     * @returns Note Note stored
     * @throws ApiError
     */
    public static addApplicationNote({
        id,
        requestBody,
    }: {
        id: string,
        requestBody: NoteCreate,
    }): CancelablePromise<Note> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/applications/{id}/notes',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                404: `Not found`,
            },
        });
    }
    /**
     * Update application status
     * @returns ApplicationSummary Status updated
     * @throws ApiError
     */
    public static updateApplicationStatus({
        id,
        requestBody,
    }: {
        id: string,
        requestBody: StatusUpdate,
    }): CancelablePromise<ApplicationSummary> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/applications/{id}/status',
            path: {
                'id': id,
            },
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
