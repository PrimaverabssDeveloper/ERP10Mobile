import {
    Component,
    OnInit,
    OnDestroy,
} from '@angular/core';

import {
    Location
} from '@angular/common';

import {
    PopoverController,
    LoadingController,
    MenuController
} from '@ionic/angular';

import {
    PageBase
} from '../../../shared/pages';

import {
    SalesService,
    SalesServiceProvider,
    SalesSettingsService
} from '../../services';

import {
    LocaleService
} from '../../../core/services';

import { LocalizedStringsPipe, CurrencySymbolPipe } from '../../../shared/pipes';
import { Subscription } from 'rxjs';
import { PopoverSelectorComponent } from '../../../shared/components';
import { ActivatedRoute } from '@angular/router';
import { SalesChartsData } from '../../../sales-charts/components';
import { Company, CompanySales } from '../../entities';
import { ChartPeriodType } from '../../../sales-charts/entities';

@Component({
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    providers: [SalesServiceProvider, CurrencySymbolPipe, LocalizedStringsPipe]
})
export class HomePage extends PageBase implements OnInit, OnDestroy {

    private companies: Company[];

    private localeChangedSubscription: Subscription;
    private useReferenceCurrencySettingChangedSubscription: Subscription;

    private isCompanySelectorPopoverVisible: boolean;

    selectedCompanySales: CompanySales;
    selectedChartBundleKey: string;
    selectedChartBundlePeriodType: ChartPeriodType;
    selectedChartBundleLocalizedTitles: { [key: string]: string };
    selectedChartBundleIsTimeChart: boolean;
    extraInfoValue: string;

    selectedPeriod: string;

    showTimeFrameSelector: boolean;

    public dataDate: Date;


    salesChartsData: SalesChartsData;


    constructor(
        public popoverController: PopoverController,
        public loadingController: LoadingController,
        public location: Location,
        public menuController: MenuController,
        private route: ActivatedRoute,
        private salesService: SalesService,
        private salesSettingsService: SalesSettingsService,
        private localeService: LocaleService,
    ) {

        super(loadingController, location, menuController);
    }

    async ngOnInit() {

        await this.showLoading();

        // get all companies
        this.companies = await this.salesService.getCompanies();

        if (!this.companies) {
            this.goBack();
            await this.hideLoading();
            return;
        }

        // by default show the first company
        let companyToShow = this.companies[0];

        const keyFromCompanyToShow = this.route.snapshot.params['company'];

        // shows the company that was provided a parameter
        if (keyFromCompanyToShow) {
            companyToShow = this.companies.find(c => c.key === keyFromCompanyToShow);
            companyToShow = companyToShow ? companyToShow : this.companies[0];
        }

        this.showCompanyData(companyToShow);

        // when the locale change, refresh the view
        // so the currencies and date format take the new locale
        this.localeChangedSubscription =
            this.localeService
                .localeChanged
                .subscribe(() => {
                    this.updateCharts(this.selectedCompanySales);
                });

        // when the reference currency setting changes, refresh the view
        // so the monetary values use the right value
        this.useReferenceCurrencySettingChangedSubscription =
            this.salesSettingsService
                .useReferenceCurrencySettingChanged
                .subscribe(() => {
                    this.updateCharts(this.selectedCompanySales);
                });

        await this.hideLoading();
    }

    async ngOnDestroy() {
        if (this.localeChangedSubscription) {
            this.localeChangedSubscription.unsubscribe();
            this.localeChangedSubscription = null;
        }

        if (this.useReferenceCurrencySettingChangedSubscription) {
            this.useReferenceCurrencySettingChangedSubscription.unsubscribe();
            this.useReferenceCurrencySettingChangedSubscription = null;
        }
    }

    async showCompanySelectorAction(event: any) {

        // this will prevent the company to be show more than once at the same time
        if (this.isCompanySelectorPopoverVisible) {
            return;
        }

        this.isCompanySelectorPopoverVisible = true;

        const popover = await this.popoverController.create({
            component: PopoverSelectorComponent,
            componentProps: {
                items: this.companies.map(c => ({label: c.key, data: c})),
                onItemSelected: (item: {label: string, data: any}) => {
                    this.showCompanyData(item.data);
                    popover.dismiss();
                }
            },
            backdropDismiss: true,
            event: event,
            translucent: true,
        });

        popover.onDidDismiss().then(() => {
            this.isCompanySelectorPopoverVisible = false;
        });

        await popover.present();
    }

    // #region 'Protected Methods'

    protected getMenuId(): string {
        return 'sales-home-page-menu';
    }

    // #endregion

    private async showCompanyData(company: Company) {

        // get sales charts for the company
        const companySales = await this.salesService.getSalesCharts(company.key);

        if (companySales) {
            this.selectedCompanySales = companySales;
            await this.updateCharts(this.selectedCompanySales);
        } else {

            if (!this.selectedCompanySales) {
                // this is the case when the user will see the charts for the first time
                // in this case, return to the previous screen
                this.goBack();
            }

            await this.hideLoading();
        }
    }

    private async updateCharts(companySales: CompanySales) {
        const useReportingValue = await this.salesSettingsService.getUseReferenceCurrencySettingValueAsync();

        this.salesChartsData = {
            companyKey: companySales.key,
            chartBundles: this.selectedCompanySales.chartBundle,
            useReportingValue: useReportingValue,
            accentColor: {r: 29, g: 49, b: 125},
            currentYearAccentColor: {r: 29, g: 49, b: 125},
            previousYearAccentColor: {r: 219, g: 224, b: 235}
        };
    }
}
