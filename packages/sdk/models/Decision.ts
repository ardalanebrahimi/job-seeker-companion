/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Decision = {
    /**
     * Auto-decided persona label (V1)
     */
    persona?: string;
    /**
     * Applied Reality Index (0-2) (V1)
     */
    realityIndex?: number;
    /**
     * Top signals that influenced persona choice (V1)
     */
    signals?: Array<string>;
    /**
     * JD keywords emphasized in output (V1)
     */
    keywordsEmphasized?: Array<string>;
    /**
     * Why this style/template was chosen (V1)
     */
    styleRationale?: string;
    /**
     * Available emphasis toggles for re-generation (V1)
     */
    switches?: Array<{
        /**
         * e.g., "Emphasize leadership"
         */
        label?: string;
        /**
         * Current state of this switch
         */
        active?: boolean;
    }>;
    /**
     * Claim-to-fact mappings for transparency (V1)
     */
    provenanceLinks?: Array<{
        /**
         * Text of the claim in generated document
         */
        claimText?: string;
        /**
         * ID of supporting resume fact
         */
        sourceFactId?: string;
        factType?: 'role' | 'project' | 'education' | 'cert' | 'skill';
    }>;
};

