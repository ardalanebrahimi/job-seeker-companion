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
import type { DocumentDiff } from '../models/DocumentDiff';
import type { DocumentHistory } from '../models/DocumentHistory';
import type { Note } from '../models/Note';
import type { NoteCreate } from '../models/NoteCreate';
import type { Reminder } from '../models/Reminder';
import type { ReminderCreate } from '../models/ReminderCreate';
import type { ReminderWithApplication } from '../models/ReminderWithApplication';
import type { StatusUpdate } from '../models/StatusUpdate';
import type { VariantGenerateRequest } from '../models/VariantGenerateRequest';
import type { VariantGenerateResponse } from '../models/VariantGenerateResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ApplicationsService {
    /**
     * List applications with filtering and search (V2)
     * @returns ApplicationList List of applications
     * @throws ApiError
     */
    public static listApplications({
        page = 1,
        pageSize = 20,
        status,
        company,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc',
    }: {
        page?: number,
        pageSize?: number,
        status?: ApplicationStatus,
        company?: string,
        /**
         * Search in company, title, and notes
         */
        search?: string,
        sortBy?: 'createdAt' | 'appliedAt' | 'status' | 'company',
        sortOrder?: 'asc' | 'desc',
    }): CancelablePromise<ApplicationList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/applications',
            query: {
                'page': page,
                'pageSize': pageSize,
                'status': status,
                'company': company,
                'search': search,
                'sortBy': sortBy,
                'sortOrder': sortOrder,
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
     * Export applications list (V2)
     * @returns ApplicationSummary Exported applications data
     * @throws ApiError
     */
    public static exportApplications({
        format = 'csv',
        status,
        company,
        search,
    }: {
        format?: 'csv' | 'json',
        status?: ApplicationStatus,
        company?: string,
        search?: string,
    }): CancelablePromise<Array<ApplicationSummary>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/applications/export',
            query: {
                'format': format,
                'status': status,
                'company': company,
                'search': search,
            },
            errors: {
                401: `Unauthorized`,
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
     * Generate multiple document variants for an application (V3)
     * @returns VariantGenerateResponse Document variants generated
     * @throws ApiError
     */
    public static generateDocumentVariants({
        id,
        requestBody,
    }: {
        id: string,
        requestBody: VariantGenerateRequest,
    }): CancelablePromise<VariantGenerateResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/applications/{id}/variants',
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
     * Preview a document in the browser (V3)
     * @returns string Document preview
     * @throws ApiError
     */
    public static previewDocument({
        id,
        documentId,
    }: {
        id: string,
        documentId: string,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/applications/{id}/documents/{documentId}/preview',
            path: {
                'id': id,
                'documentId': documentId,
            },
            errors: {
                401: `Unauthorized`,
                404: `Not found`,
            },
        });
    }
    /**
     * Download a document file (V3)
     * @returns binary Document file
     * @throws ApiError
     */
    public static downloadDocument({
        id,
        documentId,
    }: {
        id: string,
        documentId: string,
    }): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/applications/{id}/documents/{documentId}/download',
            path: {
                'id': id,
                'documentId': documentId,
            },
            errors: {
                401: `Unauthorized`,
                404: `Not found`,
            },
        });
    }
    /**
     * Get diff between generated document and base CV (V3)
     * @returns DocumentDiff Document diff
     * @throws ApiError
     */
    public static getDocumentDiff({
        id,
        documentId,
    }: {
        id: string,
        documentId: string,
    }): CancelablePromise<DocumentDiff> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/applications/{id}/documents/{documentId}/diff',
            path: {
                'id': id,
                'documentId': documentId,
            },
            errors: {
                401: `Unauthorized`,
                404: `Not found`,
            },
        });
    }
    /**
     * Get document history with versions (V3)
     * @returns DocumentHistory Document history
     * @throws ApiError
     */
    public static getDocumentHistory({
        id,
    }: {
        id: string,
    }): CancelablePromise<DocumentHistory> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/applications/{id}/documents/history',
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
     * Update a note on an application (V2)
     * @returns Note Note updated
     * @throws ApiError
     */
    public static updateApplicationNote({
        id,
        noteId,
        requestBody,
    }: {
        id: string,
        noteId: string,
        requestBody: NoteCreate,
    }): CancelablePromise<Note> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/applications/{id}/notes/{noteId}',
            path: {
                'id': id,
                'noteId': noteId,
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
     * Delete a note from an application (V2)
     * @returns void
     * @throws ApiError
     */
    public static deleteApplicationNote({
        id,
        noteId,
    }: {
        id: string,
        noteId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/applications/{id}/notes/{noteId}',
            path: {
                'id': id,
                'noteId': noteId,
            },
            errors: {
                401: `Unauthorized`,
                404: `Not found`,
            },
        });
    }
    /**
     * Set a reminder for an application (V2)
     * @returns Reminder Reminder set
     * @throws ApiError
     */
    public static setApplicationReminder({
        id,
        requestBody,
    }: {
        id: string,
        requestBody: ReminderCreate,
    }): CancelablePromise<Reminder> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/applications/{id}/reminders',
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
     * Get reminders for an application (V2)
     * @returns Reminder Application reminders
     * @throws ApiError
     */
    public static getApplicationReminders({
        id,
    }: {
        id: string,
    }): CancelablePromise<Array<Reminder>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/applications/{id}/reminders',
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
     * Delete an application and all linked documents (V2)
     * @returns void
     * @throws ApiError
     */
    public static deleteApplication({
        id,
    }: {
        id: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/applications/{id}/delete',
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
     * Regenerate application docs with modified switches/settings (V1)
     * @returns ApplicationGenerateResponse Application regenerated with new settings
     * @throws ApiError
     */
    public static regenerateApplicationDocuments({
        id,
        requestBody,
    }: {
        id: string,
        requestBody: {
            /**
             * Modified emphasis switches
             */
            switches?: Array<{
                label?: string;
                active?: boolean;
            }>;
            realityIndex?: number;
            stylePreference?: 'concise' | 'balanced' | 'detailed';
        },
    }): CancelablePromise<ApplicationGenerateResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/applications/{id}/regenerate',
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
    /**
     * Get upcoming reminders across all applications (V2)
     * @returns ReminderWithApplication Upcoming reminders
     * @throws ApiError
     */
    public static getUpcomingReminders({
        limit = 10,
    }: {
        limit?: number,
    }): CancelablePromise<Array<ReminderWithApplication>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/reminders',
            query: {
                'limit': limit,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Mark a reminder as completed (V2)
     * @returns Reminder Reminder marked as completed
     * @throws ApiError
     */
    public static completeReminder({
        id,
    }: {
        id: string,
    }): CancelablePromise<Reminder> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/reminders/{id}/complete',
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
