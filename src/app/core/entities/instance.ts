import { Module } from './module';

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
     * The account key.
     *
     * @type {string}
     * @memberof Instance
     */
    accountKey: string;

    /**
     * The subscription alias.
     *
     * @type {string}
     * @memberof Instance
     */
    subscriptionAlias: string;

    /**
     * Defines the Instance Description;
     *
     * @type {string}
     * @memberof Instance
     */
    description: string;

    /**
     * Instance available modules.
     *
     * @type {Module[]}
     * @memberof Instance
     */
    modules: Module[];
}
