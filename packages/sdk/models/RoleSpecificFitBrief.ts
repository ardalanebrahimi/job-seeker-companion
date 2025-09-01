/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RoleSpecificFitBrief = {
    id: string;
    applicationId: string;
    fitReasons: Array<{
        reason: string;
        evidence: string;
        strength: 'high' | 'medium' | 'low';
    }>;
    skillAlignments: Array<{
        skill: string;
        userExperience: string;
        companyNeed: string;
        matchScore: number;
    }>;
    tone?: string;
    createdAt: string;
};

