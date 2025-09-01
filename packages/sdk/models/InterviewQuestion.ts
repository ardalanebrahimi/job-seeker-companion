/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type InterviewQuestion = {
    id: string;
    question: string;
    category: InterviewQuestion.category;
    difficulty: InterviewQuestion.difficulty;
    /**
     * ID of linked STAR story if applicable
     */
    linkedStoryId?: string | null;
    tips?: Array<string>;
};
export namespace InterviewQuestion {
    export enum category {
        ROLE_SPECIFIC = 'role-specific',
        COMPANY_SPECIFIC = 'company-specific',
        BEHAVIORAL = 'behavioral',
    }
    export enum difficulty {
        EASY = 'easy',
        MEDIUM = 'medium',
        HARD = 'hard',
    }
}

