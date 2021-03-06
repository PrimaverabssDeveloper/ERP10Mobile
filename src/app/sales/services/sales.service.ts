import { SalesSummary, Company, SalesCharts, SalesSettings, CompanySalesData, CompanySales } from '../entities';
import { InstanceHttpRequestService, DomService } from '../../core/services';
import { TotalSalesTickerComponent, DailySalesTickerComponent } from '../components';
import { SalesStorageService } from './sales-storage.service';
import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { SalesSettingsService } from '.';

const SALES_SUMMARY = '/sales';
const SALES_BY_COMPANY = '/sales?companyKey=';

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
        protected storage: SalesStorageService,
        protected salesSettingsService: SalesSettingsService
    ) {
    }

    // #endregion

    // #region 'Public Methods'


    async createSalesSummaryTickers(): Promise<HTMLElement[]> {

        const salesSummary = await this.getSalesSummary();

        // error gettings summaries
        if (!salesSummary) {
            return [];
        }

        const htmlTickers: HTMLElement[] = [];
        for (const company of salesSummary.companies) {

            // total sales ticker
            const totalSalesTickerHtml = this.domService.createComponent(TotalSalesTickerComponent, { companySalesSummary: company, salesSettingsService: this.salesSettingsService });
            htmlTickers.push(totalSalesTickerHtml);

            // daily sales ticker
            const dailySalesProperties = { companyDailySalesSummary: company.dailySales, salesSettingsService: this.salesSettingsService };
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

        // error gettings summaries
        if (!salesSummary) {
            return null;
        }

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

    async getSalesCharts(companyKey: string): Promise<CompanySales> {

        let salesData: CompanySalesData;
        const endpoint = `${SALES_BY_COMPANY}${companyKey}`;
        try {
            salesData = await this.instanceHttpRequestService.get<CompanySalesData>(endpoint);
        } catch (error) {
            console.log(error);
            return null;
        }

        return salesData ? salesData.data : null;
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
