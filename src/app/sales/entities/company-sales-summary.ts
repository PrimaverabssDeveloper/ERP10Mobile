import { CompanyDailySalesSummary } from './company-daily-sales-summary';

/**
 * Defines the sales summary of a Campany.
 *
 * @export
 * @interface Company
 */
export interface CompanySalesSummary {

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
     * The company total sales for the current year.
     *
     * @type {number}
     * @memberof CompanySalesSummary
     */
    totalSales: number;

    /**
     * The company total sales for the current year on the reporting currency.
     *
     * @type {number}
     * @memberof CompanySalesSummary
     */
    totalSalesReporting: number;

    /**
     * The company total sales for the previous year.
     *
     * @type {number}
     * @memberof CompanySalesSummary
     */
    totalSalesPrevious: number;

    /**
     * The company total sales fot the previous year on the reporting currency.
     *
     * @type {number}
     * @memberof CompanySalesSummary
     */
    totalSalesPreviousReporting: number;

    /**
     * The current company currency. All money values are on this currency,
     * except the 'reporting values'.
     *
     * @type {string}
     * @memberof CompanySalesSummary
     */
    currency: string;

    /**
     * The reporting currency. Any 'reporting value' is in this currency.
     * Non 'reporting values' are on the currency defined by the property 'currency'.
     *
     * @type {string}
     * @memberof CompanySalesSummary
     */
    reportingCurrency: string;

    /**
     * The legend to be used when the total sales values
     * for the current year are shown.
     *
     * @type {string}
     * @memberof CompanySalesSummary
     */
    totalSalesLegend: string;

    /**
     * The legend to be used when the total sales value
     * for the previous year are shown.
     *
     * @type {string}
     * @memberof CompanySalesSummary
     */
    totalSalesPreviousLegend: string;

    /**
     * The date when the sales values were processed.
     *
     * @type {String}
     * @memberof CompanySalesSummary
     */
    dataTimestamp: string;

    /**
     * Defines the Sales Summary of a company for the current day.
     *
     * @type {CompanyDailySalesSummary}
     * @memberof CompanySalesSummary
     */
    dailySales: CompanyDailySalesSummary;
}
