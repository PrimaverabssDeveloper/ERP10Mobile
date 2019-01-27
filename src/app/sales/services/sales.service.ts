import { SalesSummary, Company, SalesCharts, SalesSettings } from '../entities';
import { InstanceHttpRequestService, DomService } from '../../core/services';
import { TotalSalesTickerComponent, DailySalesTickerComponent } from '../components';
import { SalesStorageService } from './sales-storage.service';

const SALES_SUMMARY = '/sales';

/**
 * The Sales Service provide all data needed to the Sales Module.
 * It has all data requests to the server
 * and transform the data to be used on presentation component.
 *
 * @export
 * @class SalesService
 */
export class SalesService {

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
        protected storage: SalesStorageService
        ) {
    }

    // #endregion

    // #region 'Public Methods'


    async createSalesSummaryTickers(): Promise<HTMLElement[]> {

        const salesSummary = await this.getSalesSummary();

        const htmlTickers: HTMLElement[] = [];
        for (const company of salesSummary.companies) {

            // total sales ticker
            const totalSalesTickerHtml = this.domService.createComponent(TotalSalesTickerComponent, { companySalesSummary: company });
            htmlTickers.push(totalSalesTickerHtml);

            // daily sales ticker
            const dailySalesProperties = { companyDailySalesSummary: company.dailySales };
            const dailySalesTickerHtml = this.domService.createComponent(DailySalesTickerComponent, dailySalesProperties);
            htmlTickers.push(dailySalesTickerHtml);
        }

        return htmlTickers;
    }

    /**
     * Get the companies.
     *
     * @returns {Promise<Company[]>}
     * @memberof SalesService
     */
    async getCompanies(): Promise<Company[]> {
        const salesSummary = await this.getSalesSummary();
        let companies: Company[];

        if (salesSummary && salesSummary.companies) {
            companies = this.extractCompaniesFromSalesSummary(salesSummary);
        }

        return companies;
    }

    /**
     * Gets the Sales Summaries
     *
     * @returns {Promise<SalesSummary>}
     * @memberof SalesService
     */
    async getSalesSummary(): Promise<SalesSummary> {

        let salesSummary: SalesSummary;

        try {
            salesSummary = await this.instanceHttpRequestService
                                     .get<SalesSummary>(SALES_SUMMARY);
        } catch (error) {
            console.log(error);
            return null;
        }

        return salesSummary;
    }

    async getSalesCharts(): Promise<SalesCharts> {

        // let salesSummary: SalesSummary;

        // try {
        //     salesSummary = await this.instanceHttpRequestService
        //         .get<SalesSummary>(SALES_SUMMARY)
        //         .toPromise();
        // } catch (error) {
        //     console.log(error);
        //     return null;
        // }

        // return salesSummary;
        return null;
    }

    /**
     * Provide the sales setting.
     *
     * @returns {Promise<SalesSettings>}
     * @memberof SalesService
     */
    async getSettingsAsync(): Promise<SalesSettings> {
        let settings: SalesSettings = await this.storage.getData<SalesSettings>('SETTINGS', true);

        // create the default settings state
        if (!settings) {
            settings = {
                useReferenceCurrency: false,
                showAggregateData: true,
                showDailySales: true
            };
        }

        return settings;
    }

    /**
     * Stores the sales settings.
     *
     * @param {SalesSettings} settings
     * @memberof SalesService
     */
    async updateSettingsAsync(settings: SalesSettings) {
        await this.storage.setData('SETTINGS', settings, true);
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
