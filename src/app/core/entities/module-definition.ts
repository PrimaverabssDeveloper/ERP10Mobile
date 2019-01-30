
/**
 * Defines a module definitions.
 *
 * @export
 * @interface ModuleDefinition
 */
export interface ModuleDefinition {
    /**
     * The module key.
     *
     * @type {string}
     * @memberof ModuleDefinition
     */
    key: string;

    /**
     * The key to get the translated name.
     *
     * @type {string}
     * @memberof ModuleDefinition
     */
    localizedNameKey: string;


    /**
     * The relevance betwheen modules when displayed side-by-side.
     *
     * @type {number}
     * @memberof ModuleDefinition
     */
    displayRelevance: number;

    /**
     * The module icon path.
     *
     * @type {string}
     * @memberof ModuleDefinition
     */
    iconPath: string;

    /**
     * Module route path.
     *
     * @type {string}
     * @memberof ModuleDefinition
     */
    moduleRoutePath: string;

    /**
     * Define if the module has settings and provides the path to the settings page.
     *
     * @type {{
     *         hasSettings: boolean;
     *         settingsRoutePath?: string;
     *     }}
     * @memberof ModuleDefinition
     */
    settings: {
        hasSettings: boolean;
        settingsRoutePath?: string;
    };

    /**
     * Define if the module has summaries ('initial page info tickers') and the function to provide the summaries withgets.
     *
     * @memberof ModuleDefinition
     */
    summaries: {
        hasSummaries: boolean;
        summariesHandler?: () => Promise<HTMLElement[]>;
    };
}
