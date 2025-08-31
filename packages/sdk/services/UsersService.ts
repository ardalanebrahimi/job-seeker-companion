/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CvPreview } from '../models/CvPreview';
import type { CvUploadResponse } from '../models/CvUploadResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
    /**
     * Upload base CV (DOCX or PDF)
     * @returns CvUploadResponse CV stored and parsed
     * @throws ApiError
     */
    public static uploadBaseCv({
        formData,
    }: {
        formData: {
            file: Blob;
            filename?: string;
            /**
             * ISO language tag (e.g., en, de)
             */
            language?: string;
        },
    }): CancelablePromise<CvUploadResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/me/cv',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Get parsed base CV preview
     * @returns CvPreview Parsed CV facts and file references
     * @throws ApiError
     */
    public static getBaseCvPreview(): CancelablePromise<CvPreview> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/me/cv',
            errors: {
                401: `Unauthorized`,
                404: `Not found`,
            },
        });
    }
}
