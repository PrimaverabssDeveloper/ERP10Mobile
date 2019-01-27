
/**
 * Defines the Sales Summary of a company for the current day.
 *
 * @export
 * @interface CompanyDailySalesSummary
 */
export interface CompanyDailySalesSummary {
    /**
     * The company Key. The key is unique to each company.
     *
     * @type {string}
     * @memberof Company
     */
    key: string;

    /**
     * The company Name.
     *
     * @type {string}
     * @memberof Company
     */
    name: string;

    /**
     * The company sales for today.
     *
     * @type {number}
     * @memberof CompanyDailySalesSummary
     */
    sales: number;

    /**
     * The company sales for today on the reporting currency.
     *
     * @type {number}
     * @memberof CompanyDailySalesSummary
     */
    salesReporting: number;

    /**
     * The company sales from last week day.
     *
     * @type {number}
     * @memberof CompanyDailySalesSummary
     */
    salesPrevious: number;

    /**
     * The company sales from last week day on the reporting currency.
     *
     * @type {number}
     * @memberof CompanyDailySalesSummary
     */
    salesPreviousReporting: number;

    /**
     * The current company currency. All money values are on this currency,
     * except the 'reporting values'.
     *
     * @type {string}
     * @memberof CompanyDailySalesSummary
     */
    currency: string;

    /**
     * The reporting currency. Any 'reporting value' is in this currency.
     * Non 'reporting values' are on the currency defined by the property 'currency'.
     *
     * @type {string}
     * @memberof CompanyDailySalesSummary
     */
    reportingCurrency: string;

    /**
     * The legend to be used when the total sales values
     * for today.
     *
     * @type {string}
     * @memberof CompanyDailySalesSummary
     */
    salesLegend: string;

    /**
     * The legend to be used when the total sales value
     * for the last week day.
     *
     * @type {string}
     * @memberof CompanyDailySalesSummary
     */
    salesPreviousLegend: string;

    /**
     * The date when the sales values were processed.
     *
     * @type {String}
     * @memberof CompanySalesSummary
     */
    dataTimestamp: string;
}
