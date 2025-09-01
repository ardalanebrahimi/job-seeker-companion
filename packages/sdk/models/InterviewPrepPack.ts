/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CompanySnapshot } from './CompanySnapshot';
import type { InterviewQuestion } from './InterviewQuestion';
import type { RoleSpecificFitBrief } from './RoleSpecificFitBrief';
import type { StarStory } from './StarStory';
export type InterviewPrepPack = {
    id: string;
    applicationId: string;
    companySnapshot: CompanySnapshot;
    fitBrief: RoleSpecificFitBrief;
    starStories: Array<StarStory>;
    likelyQuestions: Array<InterviewQuestion>;
    /**
     * URL to export prep pack as PDF
     */
    exportUrl?: string;
    createdAt: string;
};

