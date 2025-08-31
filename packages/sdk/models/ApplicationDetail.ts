/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApplicationHistory } from './ApplicationHistory';
import type { ApplicationStatus } from './ApplicationStatus';
import type { CoachingHints } from './CoachingHints';
import type { Decision } from './Decision';
import type { GeneratedDoc } from './GeneratedDoc';
import type { JobDetail } from './JobDetail';
import type { Note } from './Note';
import type { Reminder } from './Reminder';
export type ApplicationDetail = {
    id: string;
    job?: JobDetail;
    status: ApplicationStatus;
    notes?: Array<Note>;
    docs?: Array<GeneratedDoc>;
    decision?: Decision;
    /**
     * Active reminders for this application (V2)
     */
    reminders?: Array<Reminder>;
    /**
     * History log of all changes (V2)
     */
    history?: ApplicationHistory;
    /**
     * Current coaching hints (V2)
     */
    coachingHints?: CoachingHints;
    createdAt: string;
    updatedAt?: string;
};

