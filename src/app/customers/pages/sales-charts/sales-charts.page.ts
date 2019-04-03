import { PageBase } from '../../../shared/pages';
import { Location } from '@angular/common';
import { LoadingController, MenuController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { CustomersService, CustomersServiceProvider } from '../../services';
import { ActivatedRoute } from '@angular/router';
import { SalesChartsData } from '../../../sales-charts/components';
import { ChartBundle } from '../../../sales/entities';

@Component({
    templateUrl: './sales-charts.page.html',
    styleUrls: ['./sales-charts.page.scss', '../../styles/common.scss'],
    providers: [CustomersServiceProvider]
})
export class SalesChartsPage extends PageBase implements OnInit {

    salesChartsData: SalesChartsData;
    pageTitle: string;

    constructor(
        public loadingController: LoadingController,
        public location: Location,
        public menuController: MenuController,
        private route: ActivatedRoute,
        private customersService: CustomersService
    ) {
        super(loadingController, location, menuController);
    }

    /**
    * Execute on page initialization.
    *
    * @memberof SalesChartsPage
    */
    async ngOnInit() {
        const companyKey = this.route.snapshot.paramMap.get('companyKey');
        const customerKey = this.route.snapshot.paramMap.get('customerKey');

        this.pageTitle = customerKey;

        await this.showLoading();
        let result: any;
        try {
            result = await this.customersService.getSalesCharts(companyKey, customerKey);
            this.updateCharts(companyKey, result.data.chartBundle);
        } catch (error) {
            console.log(error);
        }

        if (!result) {
            this.goBack();
        }

        await this.hideLoading();
    }

    // #region 'Protected Methods'

    protected getMenuId(): string {
        return 'customers-sales-charts-page-menu';
    }

    // #endregion

    private updateCharts(companyKey: string, chartsBundle: ChartBundle[] ) {

        this.salesChartsData = {
            companyKey: companyKey,
            chartBundles: chartsBundle,
            useReportingValue: false,
            accentColor: {r: 81, g: 131, b: 254},
            currentYearAccentColor: {r: 29, g: 49, b: 125},
            previousYearAccentColor: {r: 219, g: 224, b: 235}
        };
    }
}
