/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApplicationStatus } from './ApplicationStatus';
import type { Decision } from './Decision';
import type { GeneratedDoc } from './GeneratedDoc';
import type { JobDetail } from './JobDetail';
import type { Note } from './Note';
export type ApplicationDetail = {
    id: string;
    job?: JobDetail;
    status: ApplicationStatus;
    notes?: Array<Note>;
    docs?: Array<GeneratedDoc>;
    decision?: Decision;
};

