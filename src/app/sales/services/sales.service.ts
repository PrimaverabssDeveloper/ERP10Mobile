import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SalesSummary, Company } from '../entities';
import { InstanceHttpRequestService } from '../../core/services';
import { EventEmitter } from '@ionic/core/dist/types/stencil.core';

const SALES_SUMMARY = '/sales';

/**
 * The Sales Service provide all data needed to the Sales Module.
 * It has all data requests to the server
 * and transform the data to be used on presentation component.
 *
 * @export
 * @class SalesService
 */
@Injectable({
    providedIn: 'root',
})
export class SalesService {

    // #region 'Private Properties'

    private companies: Company[];

    // #endregion

    // #region 'Public Properties'

    // #endregion

    // #region 'Constructor'

    /**
     * Creates an instance of SalesService.
     * @param {InstanceHttpRequestService} instanceHttpRequestService
     * @memberof SalesService
     */
    constructor(private instanceHttpRequestService: InstanceHttpRequestService) {

    }
    // #endregion

    // #region 'Public Methods'

    /**
     * Get the companies.
     *
     * @returns {Observable<Company[]>}
     * @memberof SalesService
     */
    getCompanies(): Observable<Company[]> {
        return new Observable<Company[]>(o => {

            // the companies already exists
            // return them
            if (this.companies) {
                o.next(this.companies);
            } else {

            }

            let sub =
                this.instanceHttpRequestService
                    .get<SalesSummary>(SALES_SUMMARY)
                    .subscribe(ss => {

                        // extract companies from sales summaries
                        if (ss && ss.companies) {
                            this.companies = ss.companies.map(css => ({ key: css.key, name: css.name }));
                        }

                        o.next(this.companies);
                    });

            return () => {
                if (sub) {
                    sub.unsubscribe();
                    sub = null;
                }
            };
        });
    }

    /**
     * Gets the Sales Summaries
     *
     * @returns {Observable<SalesSummary>}
     * @memberof SalesService
     */
    getSalesSummary(): Observable<SalesSummary> {
        return new Observable<SalesSummary>(o => {
            let sub =
                this.instanceHttpRequestService
                    .get<SalesSummary>(SALES_SUMMARY)
                    .subscribe(ss => {

                        // extract companies from sales summaries
                        if (ss && ss.companies) {
                            this.companies = this.extractCompaniesFromSalesSummary(ss);
                        }

                        o.next(ss);
                    });

            return () => {
                sub.unsubscribe();
                sub = null;
            };
        });
    }

    // #endregion

    // #region 'Private Methods'

    private extractCompaniesFromSalesSummary(salesSummary: SalesSummary): Company[] {
        if (salesSummary && salesSummary.companies) {
            return salesSummary.companies.map(css => ({ key: css.key, name: css.name }));
        } else {
            return [];
        }
    }

    // #endregion
}
