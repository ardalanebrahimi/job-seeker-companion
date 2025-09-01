/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type StarStory = {
    id: string;
    /**
     * Brief title for the story
     */
    title: string;
    /**
     * JD requirement this story addresses
     */
    category: string;
    /**
     * Situation description
     */
    situation: string;
    /**
     * Task that needed to be done
     */
    task: string;
    /**
     * Actions taken
     */
    action: string;
    /**
     * Results achieved
     */
    result: string;
    /**
     * Reality index used for this story
     */
    realityIndex: number;
    isEditable?: boolean;
    createdAt: string;
};

