import { Module } from './module';

/**
 * An instance representes each ERP Instance that the user has access.
 *
 * @interface Instance
 */
export interface Instance {

    /**
     * The account key.
     *
     * @type {string}
     * @memberof Instance
     */
    account: string;

    /**
     * The subscription alias.
     *
     * @type {string}
     * @memberof Instance
     */
    alias: string;

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
