import {
    Component,
    ViewChild,
    OnInit,
    OnDestroy,
    ElementRef
} from '@angular/core';

import {
    Location
} from '@angular/common';

import {
    CurrencyPipe
} from '@angular/common';

import {
    PopoverController,
    LoadingController,
    AlertController,
    MenuController
} from '@ionic/angular';

import {

    FooterTabMenu,
    FooterMenuItemSelectedEvent,
    FooterTabMenuItem,
    SalesChartComponent
} from '../../components';

import {
    PageBase
} from '../../../shared/pages';

import {
    SalesService,
    SalesServiceProvider,
    ChartShareService,
    SalesSettingsService
} from '../../services';

import {
    Company,
    SalesCharts,
    CompanySales,
    ChartBundle,
    ChartData,
    Serie,
    ChartPeriodType
} from '../../entities';

import {
    LocaleService
} from '../../../core/services';

import { LocalizedStringsPipe, CurrencySymbolPipe, LocaleCurrencyPipe } from '../../../shared/pipes';
import { SalesTableUpdatedEvent, SalesTableData } from '../../components/sales-table/entities';
import { SalesChartData } from '../../components/sales-chart/entities';
import { SalesChartUpdatedEvent } from '../../components/sales-chart/entities/sales-chart-updated-event';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PopoverSelectorComponent } from '../../../shared/components';



@Component({
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    providers: [SalesServiceProvider, CurrencySymbolPipe, LocalizedStringsPipe]
})
export class HomePage extends PageBase implements OnInit, OnDestroy {

    private readonly currentYearAccentColor = 'rgb(29, 49, 125)';
    private readonly previouseYearAccentColor = 'rgb(219, 224, 235)';
    private readonly currentYearAccentColorWithTransparency = 'rgba(29, 49, 125, .5)'; // it has to be in RGBA not HEX
    private readonly previouseYearAccentColorWithTransparency = 'rgba(219, 224, 235, .5)'; // it has to be in RGBA not HEX
    private readonly currentYearSeriesKey = '1';
    private readonly previousYearSeriesKey = '0';

    private companies: Company[];
    private salesCharts: SalesCharts;

    private salesTableCurrentData: SalesTableData;
    private salesChartCurrentData: SalesChartData;

    private localeChangedSubscription: Subscription;
    private useReferenceCurrencySettingChangedSubscription: Subscription;

    private isCompanySelectorPopoverVisible: boolean;

    tableData: {
        chartBundle: ChartBundle,
        chart: ChartData,
        period: string,
        timeFrame: 'monthly' | 'quarter',
        previousYearSerie: Serie,
        currentYearSerie: Serie,
        useReportingValue: boolean,
        currency: string
    };

    chartData: {
        chartBundle: ChartBundle,
        chart: ChartData,
        period: string,
        timeFrame: 'monthly' | 'quarter',
        currency: string,
        previousYearSerie: Serie,
        currentYearSerie: Serie,
        useReportingValue: boolean,
        currentYearAccentColor: string,
        previouseYearAccentColor: string,
        currentYearAccentColorWithTransparency: string,
        previouseYearAccentColorWithTransparency: string
    };

    selectedCompanySales: CompanySales;
    selectedChartBundleKey: string;
    selectedChartBundlePeriodType: ChartPeriodType;
    selectedChartBundleLocalizedTitles: { [key: string]: string };
    selectedChartBundleIsTimeChart: boolean;
    extraInfoValue: string;

    selectedPeriod: string;

    showTimeFrameSelector: boolean;

    @ViewChild('saleschart') saleschartcomponent: SalesChartComponent;

    timeFrame: 'monthly' | 'quarter';
    valueType: 'abs' | 'accum';
    viewType: 'chart' | 'table';

    footerTabMenus: FooterTabMenu[];

    public dataDate: Date;

    constructor(
        public popoverController: PopoverController,
        public loadingController: LoadingController,
        public location: Location,
        public menuController: MenuController,
        private alertController: AlertController,
        private salesService: SalesService,
        private salesSettingsService: SalesSettingsService,
        private localeService: LocaleService,
        private localeCurrencyPipe: LocaleCurrencyPipe,
        private translate: TranslateService,
        private chartShareService: ChartShareService
    ) {

        super(loadingController, location, menuController);

        this.dataDate = new Date();
        this.timeFrame = 'monthly';
        this.valueType = 'abs';
        this.viewType = 'chart';
        this.showTimeFrameSelector = true;
        this.selectedPeriod = '1';
    }

    async ngOnInit() {

        await this.showLoading();

        // get all companies
        this.companies = await this.salesService.getCompanies();

        if (!this.companies) {
            alert('NO COMPANIES');
        }

        this.showCompanyData(this.companies[0]);

        // when the locale change, refresh the view
        // so the currencies and date format take the new locale
        this.localeChangedSubscription =
            this.localeService
                .localeChanged
                .subscribe(() => {
                    this.updateView();
                });

        // when the reference currency setting changes, refresh the view
        // so the monetary values use the right value
        this.useReferenceCurrencySettingChangedSubscription =
            this.salesSettingsService
                .useReferenceCurrencySettingChanged
                .subscribe(() => {
                    this.updateView();
                });

        this.hideLoading();
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

    changeTimeFrameAction(timeFrame: 'monthly' | 'quarter') {
        this.timeFrame = timeFrame;
        this.updateView();
    }

    changeValueType(valueType: 'abs' | 'accum') {
        this.valueType = valueType;
        this.updateView();
    }

    toggleTableView() {
        this.viewType = this.viewType === 'table' ? 'chart' : 'table';
        this.updateView();
    }

    onFooterMenuItemSelected(event: FooterMenuItemSelectedEvent) {
        // select the option
        if (event.menu.key === 'share') {
            this.shareChart(event.menuItem.key);
        } else {
            this.selectedChartBundleKey = event.menuItem.key;
            this.updateView();
        }
    }

    onPeriodChanged(period: string) {
        this.selectedPeriod = period;
        this.updateView();
    }

    onTableUpdated(event: SalesTableUpdatedEvent) {
        if (event) {
            this.salesTableCurrentData = event.tableData;
        }
    }

    onChartUpdated(event: SalesChartUpdatedEvent) {
        if (event) {
            this.salesChartCurrentData = event.chartData;
        }
    }

    // #region 'Protected Methods'

    protected getMenuId(): string {
        return 'sales-home-page-menu';
    }

    // #endregion

    private async showCompanyData(company: Company) {

        // get sales charts for the company
        this.selectedCompanySales = await this.salesService.getSalesCharts(company.key);

        // by default, select the first chart bundle key
        this.selectedChartBundleKey = this.selectedCompanySales.chartBundle[0].key;

        // update view
        this.updateView();
    }

    private async updateView() {

        this.updateFooterMenu(this.selectedCompanySales);

        const chartBundle = this.selectedCompanySales.chartBundle.find(b => b.key === this.selectedChartBundleKey);
        this.selectedChartBundleLocalizedTitles = chartBundle.titles;
        this.selectedChartBundleIsTimeChart = chartBundle.isTimeChart;
        this.selectedChartBundlePeriodType = chartBundle.periodType;

        const useReportingValue = await this.salesSettingsService.getUseReferenceCurrencySettingValueAsync();
        const currency = useReportingValue ? chartBundle.reportingCurrency : chartBundle.currency;
        const chart = chartBundle.charts.find(c => c.valueType === this.valueType);

        const currentYearSerie = this.getSerieWithKey(chartBundle.series, this.currentYearSeriesKey);
        const previousYearSerie = this.getSerieWithKey(chartBundle.series, this.previousYearSeriesKey);

        // chart data
        this.chartData = {
            chart: chart,
            chartBundle: chartBundle,
            timeFrame: this.timeFrame,
            period: this.selectedPeriod,
            currency: currency,
            useReportingValue: useReportingValue,
            previousYearSerie: previousYearSerie,
            currentYearSerie: currentYearSerie,
            currentYearAccentColor: this.currentYearAccentColor,
            currentYearAccentColorWithTransparency: this.currentYearAccentColorWithTransparency,
            previouseYearAccentColor: this.previouseYearAccentColor,
            previouseYearAccentColorWithTransparency: this.previouseYearAccentColorWithTransparency
        };

        // table data
        this.tableData = {
            chartBundle: chartBundle,
            chart: chart,
            timeFrame: this.timeFrame,
            period: this.selectedPeriod,
            previousYearSerie: previousYearSerie,
            currentYearSerie: currentYearSerie,
            useReportingValue: useReportingValue,
            currency: currency
        };

        this.showTimeFrameSelector = chartBundle.isTimeChart && chartBundle.periodType === ChartPeriodType.Month;

        // extra info
        this.extraInfoValue = '';
        if (chartBundle.isTimeChart) {
            const totalDataSet = chart.dataSet.find(ds => ds.hasTotal);
            if (totalDataSet) {
                const totalDataPoint = totalDataSet.dataPoints.find(dp => dp.isTotal);

                if (totalDataPoint) {
                    const value = this.getCorrectValue(totalDataPoint.values[1], useReportingValue);
                    const moneyValue = this.localeCurrencyPipe.transform(value, currency);
                    const totalSalesResource = await this.translate.get('SALES.CHARTS.TOTAL_SALES').toPromise();
                    this.extraInfoValue = `${totalSalesResource}: ${moneyValue}`;
                }
            }
        } else {
            const dataSet = chart.dataSet.find(ds => ds.period === this.selectedPeriod);
            if (dataSet) {
                const othersDataPoint = dataSet.dataPoints.find(dp => dp.label === '@@OTHERS@@');
                const totalsDataPoint = dataSet.dataPoints.find(dp => dp.isTotal);
                if (othersDataPoint && totalsDataPoint) {
                    const otherValue = this.getCorrectValue(othersDataPoint.values[1], useReportingValue);
                    const totalValue = this.getCorrectValue(totalsDataPoint.values[1], useReportingValue);
                    const moneyValue = this.localeCurrencyPipe.transform(otherValue, currency);
                    const ratioPercentage = this.calcPercentageRatioBetweenTwoNumbers(otherValue, otherValue + totalValue, true);
                    const rationString = ratioPercentage === 0 ? 'N/A' : `${ratioPercentage}%`;
                    const othersResource = await this.translate.get('SALES.CHARTS.OTHERS').toPromise();
                    this.extraInfoValue = `${othersResource}: ${moneyValue} // ${rationString}`;
                }
            }
        }
    }

    private updateFooterMenu(companySales: CompanySales) {

        const currentLanguage = this.localeService.language;

        const chartItems = companySales.chartBundle.map(cb => ({
            key: cb.key,
            label: cb.titles[currentLanguage],
            selected: () => cb.key === this.selectedChartBundleKey
        }));

        // const salesPersonItems: FooterTabMenuItem[] = [
        //     {
        //         key: 'sp1',
        //         label: 'Sales Person 1'
        //     },
        //     {
        //         key: 'sp2',
        //         label: 'Sales Person 2'
        //     }
        // ];

        const salesPersonItems: FooterTabMenuItem[] = null;

        this.footerTabMenus = [
            {
                key: 'charts',
                iconClass: 'pri-chart-icon',
                items: chartItems
            },
            {
                key: 'salesperson',
                iconClass: 'pri-filter-icon',
                disabledIconClass: 'pri-filter-disabled-icon',
                items: salesPersonItems
            },
            {
                key: 'share',
                iconClass: 'pri-share-icon',
                items: [
                    {
                        key: 'send_chart_by_email',
                        label: 'Send chart by email'
                    },
                    {
                        key: 'send_pdf_chart_by_email',
                        label: 'Send PDF chart by email'
                    },
                    {
                        key: 'save_image_in_the_gallery',
                        label: 'Save Image in the gallery'
                    }
                ]
            }
        ];
    }

    private getCorrectValue(value: { seriesKey: string, value: number, reportingValue: number }, useReportingValue: boolean): number {
        return useReportingValue ? value.reportingValue : value.value;
    }

    private calcPercentageRatioBetweenTwoNumbers(valueA: number, valueB: number, roundValue?: boolean) {
        if (!valueB || valueB === 0) {
            return 0;
        }

        let ratio = (valueA / valueB) * 100;
        ratio = roundValue ? Math.round(ratio) : ratio;
        return ratio;
    }

    private getSerieWithKey(series: Serie[], key: string): Serie {
        if (!series) {
            return null;
        }

        return series.find(s => s.key === key);
    }

    private shareChart(key: string) {

        switch (key) {
            case 'send_chart_by_email':
                this.shareChartImageByEmail();
                break;
            case 'send_pdf_chart_by_email':
                this.shareChartPdfByEmail();
                break;
            case 'save_image_in_the_gallery':
                this.storeImageInGallery();
                break;
            default:
                break;
        }
    }

    private async shareChartImageByEmail() {
        const chartCanvas = this.saleschartcomponent.chartCanvas.nativeElement;

        await this.chartShareService.shareChartImageByEmail(
            chartCanvas,
            this.selectedChartBundleLocalizedTitles,
            this.selectedCompanySales.key,
            this.dataDate,
            this.selectedChartBundlePeriodType,
            this.valueType,
            this.selectedChartBundleIsTimeChart,
            this.selectedPeriod,
            this.extraInfoValue,
            this.salesChartCurrentData,
            this.salesTableCurrentData
        );
    }

    private async shareChartPdfByEmail() {
        const chartCanvas = this.saleschartcomponent.chartCanvas.nativeElement;

        await this.chartShareService.shareChartPdfByEmail(
            chartCanvas,
            this.selectedChartBundleLocalizedTitles,
            this.selectedCompanySales.key,
            this.dataDate,
            this.selectedChartBundlePeriodType,
            this.valueType,
            this.selectedChartBundleIsTimeChart,
            this.selectedPeriod,
            this.extraInfoValue,
            this.salesChartCurrentData,
            this.salesTableCurrentData
        );
    }

    private async storeImageInGallery() {

        const chartCanvas = this.saleschartcomponent.chartCanvas.nativeElement;

        const success = await this.chartShareService.storeChartImageOnDeviceGallery(
            chartCanvas,
            this.selectedChartBundleLocalizedTitles,
            this.selectedCompanySales.key,
            this.dataDate,
            this.selectedChartBundlePeriodType,
            this.valueType,
            this.selectedChartBundleIsTimeChart,
            this.selectedPeriod,
            this.extraInfoValue,
            this.salesChartCurrentData,
            this.salesTableCurrentData
        );

        const message = success ? '#image stored with success' : '# not possible to store the image';

        const alert = await this.alertController.create({
            header: '',
            message: message,
            buttons: ['OK']
        });

        await alert.present();
    }
}
