import { SalesChartData } from './sales-chart-updated-event';

/**
 * Defines the event that is fired when the chart is updated.
 *
 * @export
 * @interface SalesChartUpdateEvent
 */
export interface SalesChartUpdateEvent {
    /**
     * Data that is used to build the sales chart.
     *
     * @type {SalesChartData}
     * @memberof SalesChartUpdateEvent
     */
    chartData: SalesChartData;
}
