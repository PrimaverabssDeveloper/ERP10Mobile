
/**
 * An instance representes each ERP Instance that the user has access.
 *
 * @interface Instance
 */
export interface Instance {
    /**
     * Defines the Instance Id;
     *
     * @type {string}
     * @memberof Instance
     */
    id: string;

    /**
     * Defines the Instance Key;
     *
     * @type {string}
     * @memberof Instance
     */
    key: string;


    /**
     * Defines the Instance Description;
     *
     * @type {string}
     * @memberof Instance
     */
    description: string;
}
