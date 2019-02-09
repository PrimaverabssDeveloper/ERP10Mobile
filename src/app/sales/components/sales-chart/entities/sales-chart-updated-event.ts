
/**
 * Defines the event that is fired when the chart is updated.
 *
 * @export
 * @interface SalesChartUpdatedEvent
 */
export interface SalesChartUpdatedEvent {
    /**
     * Data that is used to build the sales chart.
     *
     * @type {SalesChartData}
     * @memberof SalesChartUpdatedEvent
     */
    chartData: SalesChartData;
}

/**
 * Defines data that is needed to build the sales chart.
 *
 * @export
 * @interface SalesChartData
 */
export interface SalesChartData {
    /**
     * The current year legent.
     *
     * @type {string}
     * @memberof SalesChartData
     */
    currentYearLegend: string;

    /**
     * The previous year legend.
     *
     * @type {string}
     * @memberof SalesChartData
     */
    previousYearLegend: string;

    /**
     * The chart y axis scale step.
     *
     * @type {number}
     * @memberof SalesChartData
     */
    yAxisScaleStep: number;

    /**
     * The y axis ammount prefix.
     *
     * @type {string}
     * @memberof SalesChartData
     */
    yAxisScaleUnitPrefix: string;

    /**
     * The chart monetary currency.
     *
     * @type {string}
     * @memberof SalesChartData
     */
    currentCurrency: string;
}
