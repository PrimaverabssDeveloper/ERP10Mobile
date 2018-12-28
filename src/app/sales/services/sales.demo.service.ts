import { SalesSummary, SalesCharts } from '../entities';
import { InstanceHttpRequestService, DomService } from '../../core/services';
import { SalesService } from './sales.service';
import { HttpClient } from '@angular/common/http';
import { SalesStorageService } from './sales-storage.service';

/**
 * The Sales Service provide all data needed to the Sales Module.
 * It has all data requests to the server
 * and transform the data to be used on presentation component.
 *
 * @export
 * @class SalesService
 */
export class SalesDemoService extends SalesService {

    // #region 'Constructor'

    /**
     * Creates an instance of SalesService.
     * @param {InstanceHttpRequestService} instanceHttpRequestService
     * @param {DomService} domService
     * @memberof SalesService
     */
    constructor(
        protected instanceHttpRequestService: InstanceHttpRequestService,
        protected domService: DomService,
        protected storageService: SalesStorageService,
        private http: HttpClient,
    ) {
        super(instanceHttpRequestService, domService, storageService);
    }
    // #endregion

    // #region 'Public Methods'
    /**
     * Gets the Sales Summaries
     *
     * @returns {Promise<SalesSummary>}
     * @memberof SalesService
     */
    async getSalesSummary(): Promise<SalesSummary> {

        const salesSummary = await this.getDemoDataWithFileName<SalesSummary>('sales_summary.json');

        return salesSummary;
    }

    async getSalesCharts(): Promise<SalesCharts> {
        const salesCharts = await this.getDemoDataWithFileName<SalesCharts>('sales-charts.json');

        return salesCharts;
    }

    // #endregion

    // #region 'Private Methods'

    private getDemoDataWithFileName<T>(fileName: string): Promise<T> {
        const path = `../assets/sales/demo-data/${fileName}`;
        return this.http.get<T>(path).toPromise();
    }

    // #endregion
}
