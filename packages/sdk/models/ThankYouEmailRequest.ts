/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ThankYouEmailRequest = {
    interviewerName?: string | null;
    interviewDate: string;
    interviewType: ThankYouEmailRequest.interviewType;
    keyDiscussionPoints?: Array<string>;
    /**
     * Optional personal note to include
     */
    personalNote?: string | null;
};
export namespace ThankYouEmailRequest {
    export enum interviewType {
        PHONE = 'phone',
        VIDEO = 'video',
        IN_PERSON = 'in-person',
        PANEL = 'panel',
    }
}

