import { CompanySalesSummary } from './company-sales-summary';

/**
 * Defines a summary of sales from all companies that the used has access.
 *
 * @export
 * @interface SalesSummary
 */
export interface SalesSummary {

    /**
     * A collection of all companies that the user has access
     * with the summary of sales from the current and the previous year..
     *
     * @type {CompanySalesSummary[]}
     * @memberof SalesSummary
     */
    companies: CompanySalesSummary[];
}
