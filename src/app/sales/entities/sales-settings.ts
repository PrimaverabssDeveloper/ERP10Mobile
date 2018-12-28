
/**
 * The sales module settings.
 *
 * @export
 * @interface SalesSettings
 */
export interface SalesSettings {
    /**
     * Defines if it show the reference currency when a monetary value is displayed.
     *
     * @type {boolean}
     * @memberof SalesSettings
     */
    useReferenceCurrency: boolean;

    /**
     * Defines if it shows the aggregated sales data when showing the sales charts.
     *
     * @type {boolean}
     * @memberof SalesSettings
     */
    showAggregateData: boolean;

    /**
     * Defines if the sales ticker with the daily sales is displayed.
     *
     * @type {boolean}
     * @memberof SalesSettings
     */
    showDailySales: boolean;
}
