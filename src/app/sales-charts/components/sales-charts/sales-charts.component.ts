
import {
    Component,
    ViewChild,
    OnInit,
    OnDestroy,
    Input
} from '@angular/core';
import { ChartBundle, Serie, ChartData, ChartPeriodType } from '../../entities';
import { Subscription } from 'rxjs';
import { LocaleService } from '../../../core/services';
import { AlertController, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LocaleCurrencyPipe } from '../../../shared/pipes';
import { FooterTabMenu, FooterMenuItemSelectedEvent } from '../footer-menu';
import { SalesTableData, SalesTableUpdatedEvent } from '../sales-table/entities';
import { SalesChartData, SalesChartUpdatedEvent } from '../sales-chart/entities';
import { SalesChartComponent } from '../sales-chart/sales-chart.component';
import { ChartShareService } from '../../services';
import { SalesChartsData } from './sales-charts-data';
import { PeriodData } from '../period-selector/period-selector.component';

@Component({
    selector: 'sales-charts',
    templateUrl: 'sales-charts.component.html',
    styleUrls: ['sales-charts.component.scss']
})
export class SalesChartsComponent implements OnInit, OnDestroy {

    private loading: HTMLIonLoadingElement;

    private _data: SalesChartsData;
    private readonly currentYearSeriesKey = '1';
    private readonly previousYearSeriesKey = '0';

    private salesTableCurrentData: SalesTableData;
    private salesChartCurrentData: SalesChartData;

    private localeChangedSubscription: Subscription;
    private useReferenceCurrencySettingChangedSubscription: Subscription;

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

    selectedChartBundleKey: string;
    selectedChartBundlePeriodType: ChartPeriodType;
    selectedChartBundleLocalizedTitles: { [key: string]: string };
    selectedChartBundleIsTimeChart: boolean;
    extraInfoValue: string;

    selectedPeriod: PeriodData;
    periods: PeriodData[];

    showTimeFrameSelector: boolean;

    timeFrame: 'monthly' | 'quarter';
    valueType: 'abs' | 'accum';
    viewType: 'chart' | 'table';

    footerTabMenus: FooterTabMenu[];
    dataDate: Date;

    @ViewChild('saleschart', {static: true}) saleschartcomponent: SalesChartComponent;

    @Input() set data(value: SalesChartsData) {
        if (value) {
            this._data = value;
            this.selectedChartBundleKey = value.chartBundles[0].key;
            this.updateView();
        }
    }

    get data(): SalesChartsData {
        return this._data;
    }

    constructor(
        private alertController: AlertController,
        private localeService: LocaleService,
        private localeCurrencyPipe: LocaleCurrencyPipe,
        private translate: TranslateService,
        private chartShareService: ChartShareService,
        private loadingController: LoadingController
    ) {
        this.dataDate = new Date();
        this.timeFrame = 'monthly';
        this.valueType = 'abs';
        this.viewType = 'chart';
        this.showTimeFrameSelector = true;
    }

    async ngOnInit() {

        // when the locale change, refresh the view
        // so the currencies and date format take the new locale
        this.localeChangedSubscription =
            this.localeService
                .localeChanged
                .subscribe(() => {
                    this.updateView();
                });
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

    onPeriodChanged(period: PeriodData) {
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

    private async updateView() {

        if (!this.data || !this.data.chartBundles) {
            return;
        }


        // update dynamic colors
        const root = document.documentElement;
        root.style.setProperty('--sales-charts-accent-color', this.rgbColorBuilder(this.data.accentColor));
        root.style.setProperty('--sales-charts-current-year-accent-color', this.rgbColorBuilder(this.data.currentYearAccentColor));
        root.style.setProperty('--sales-charts-previous-year-accent-color', this.rgbColorBuilder(this.data.previousYearAccentColor));


        await this.updateFooterMenu(this.data.chartBundles);

        const chartBundle = this.data.chartBundles.find(b => b.key === this.selectedChartBundleKey);
        this.selectedChartBundleLocalizedTitles = chartBundle.titles;
        this.selectedChartBundleIsTimeChart = chartBundle.isTimeChart;
        this.selectedChartBundlePeriodType = chartBundle.periodType;

        const currency = this.data.useReportingValue ? chartBundle.reportingCurrency : chartBundle.currency;
        const chart = chartBundle.charts.find(c => c.valueType === this.valueType);

        const currentYearSerie = this.getSerieWithKey(chartBundle.series, this.currentYearSeriesKey);
        const previousYearSerie = this.getSerieWithKey(chartBundle.series, this.previousYearSeriesKey);

        // build periods
        this.periods = [];
        if (!chartBundle.isTimeChart) {

            // to daily sales
            if (chartBundle.periodType === ChartPeriodType.Daily) {
                const lastWeekRes = await this.translate.get('SALES.CHARTS.DAILY_CHART_LAST_WEEK').toPromise();
                const currentWeekRes = await this.translate.get('SALES.CHARTS.DAILY_CHART_CURRENT_WEEK').toPromise();
                const lastSeventDaysRes = await this.translate.get('SALES.CHARTS.DAILY_CHART_LAST_SEVENT_DAYS').toPromise();

                this.periods.push({
                    label: lastWeekRes,
                    period: chart.dataSet[0].period,
                    context: chartBundle.key
                });

                this.periods.push({
                    label: currentWeekRes,
                    period: chart.dataSet[1].period,
                    context: chartBundle.key
                });

                this.periods.push({
                    label: lastSeventDaysRes,
                    period: chart.dataSet[2].period,
                    context: chartBundle.key
                });

                // select the last period
                if (!this.selectedPeriod || this.selectedPeriod.context !== chartBundle.key) {
                    this.selectedPeriod = this.periods[this.periods.length - 1];
                }

            } else {
                // top 5 charts
                for (let monthIndex = 1; monthIndex <= 12; monthIndex++) {
                    const month: string = await this.translate.get(`SHARED.DATES.MONTHS.${monthIndex}`).toPromise();
                    if (month) {
                        this.periods.push({
                            label: month.slice(0, 3).toLocaleLowerCase(),
                            period: `${monthIndex}`,
                            context: chartBundle.key
                        });
                    }
                }

                // select the first period
                if (!this.selectedPeriod || this.selectedPeriod.context !== chartBundle.key) {
                    this.selectedPeriod = this.periods[0];
                }
            }
        } else {
            this.selectedPeriod = null;
        }


        // chart data
        this.chartData = {
            chart: chart,
            chartBundle: chartBundle,
            timeFrame: this.timeFrame,
            period: this.selectedPeriod ? this.selectedPeriod.period : '-1',
            currency: currency,
            useReportingValue: this.data.useReportingValue,
            previousYearSerie: previousYearSerie,
            currentYearSerie: currentYearSerie,
            currentYearAccentColor: this.rgbColorBuilder(this.data.currentYearAccentColor),
            currentYearAccentColorWithTransparency: this.rgbColorBuilder(this.data.currentYearAccentColor, .5),
            previouseYearAccentColor: this.rgbColorBuilder(this.data.previousYearAccentColor),
            previouseYearAccentColorWithTransparency: this.rgbColorBuilder(this.data.previousYearAccentColor, .5)
        };

        // table data
        this.tableData = {
            chartBundle: chartBundle,
            chart: chart,
            timeFrame: this.timeFrame,
            period: this.selectedPeriod ? this.selectedPeriod.period : '-1',
            previousYearSerie: previousYearSerie,
            currentYearSerie: currentYearSerie,
            useReportingValue: this.data.useReportingValue,
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
                    const value = this.getCorrectValue(totalDataPoint.values[1], this.data.useReportingValue);
                    const moneyValue = this.localeCurrencyPipe.transform(value, currency);
                    const totalSalesResource = await this.translate.get('SALES.CHARTS.TOTAL_SALES').toPromise();
                    this.extraInfoValue = `${totalSalesResource}: ${moneyValue}`;
                }
            }
        } else {
            const dataSet = chart.dataSet.find(ds => ds.period === this.selectedPeriod.period);
            if (dataSet) {
                const othersDataPoint = dataSet.dataPoints.find(dp => dp.label === '##OTHERS##');
                const totalsDataPoint = dataSet.dataPoints.find(dp => dp.isTotal);
                if (othersDataPoint && totalsDataPoint) {
                    const otherValue = this.getCorrectValue(othersDataPoint.values[1], this.data.useReportingValue);
                    const totalValue = this.getCorrectValue(totalsDataPoint.values[1], this.data.useReportingValue);
                    const moneyValue = this.localeCurrencyPipe.transform(otherValue, currency);
                    const ratioPercentage = this.calcPercentageRatioBetweenTwoNumbers(otherValue, otherValue + totalValue, true);
                    const rationString = ratioPercentage === 0 ? 'N/A' : `${ratioPercentage}%`;
                    const othersResource = await this.translate.get('SALES.CHARTS.OTHERS').toPromise();
                    this.extraInfoValue = `${othersResource}: ${moneyValue} // ${rationString}`;
                }
            }
        }
    }

    private async updateFooterMenu(chartBundle: ChartBundle[]): Promise<any> {

        if (!chartBundle || chartBundle.length === 0) {
            return;
        }

        const currentLanguage = this.localeService.language;

        const chartItems = chartBundle.map(cb => ({
            key: cb.key,
            label: cb.titles[currentLanguage],
            selected: () => cb.key === this.selectedChartBundleKey
        }));

        const sendChartByEmailResource = await this.translate
            .get('SALES_CHARTS.SALES_CHARTS_COMPONENT.SHARE_OPTION_SEND_CHART_BY_EMAIL')
            .toPromise();

        const sendPdfByEmailResource = await this.translate
            .get('SALES_CHARTS.SALES_CHARTS_COMPONENT.SHARE_OPTION_SEND_PDF_BY_EMAIL')
            .toPromise();

        const saveImageinTheGalleryResource = await this.translate
            .get('SALES_CHARTS.SALES_CHARTS_COMPONENT.SHARE_OPTION_SAVE_IMAGE_IN_THE_GALLERY')
            .toPromise();

        this.footerTabMenus = [
            {
                key: 'charts',
                iconClass: 'pri-chart-icon',
                items: chartItems
            },
            {
                key: 'share',
                iconClass: 'pri-share-icon',
                items: [
                    {
                        key: 'send_chart_by_email',
                        label: sendChartByEmailResource
                    },
                    {
                        key: 'send_pdf_chart_by_email',
                        label: sendPdfByEmailResource
                    },
                    {
                        key: 'save_image_in_the_gallery',
                        label: saveImageinTheGalleryResource
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
        await this.showLoading();
        const chartCanvas = this.saleschartcomponent.chartCanvas.nativeElement;

        await this.chartShareService.shareChartImageByEmail(
            chartCanvas,
            this.selectedChartBundleLocalizedTitles,
            this.data.companyKey,
            this.dataDate,
            this.selectedChartBundlePeriodType,
            this.valueType,
            this.selectedChartBundleIsTimeChart,
            this.selectedPeriod.period,
            this.extraInfoValue,
            this.salesChartCurrentData,
            this.salesTableCurrentData,
            this.rgbColorBuilder(this.data.currentYearAccentColor),
            this.rgbColorBuilder(this.data.previousYearAccentColor)
        );

        await this.hideLoading();
    }

    private async shareChartPdfByEmail() {
        await this.showLoading();
        const chartCanvas = this.saleschartcomponent.chartCanvas.nativeElement;

        await this.chartShareService.shareChartPdfByEmail(
            chartCanvas,
            this.selectedChartBundleLocalizedTitles,
            this.data.companyKey,
            this.dataDate,
            this.selectedChartBundlePeriodType,
            this.valueType,
            this.selectedChartBundleIsTimeChart,
            this.selectedPeriod.period,
            this.extraInfoValue,
            this.salesChartCurrentData,
            this.salesTableCurrentData,
            this.rgbColorBuilder(this.data.currentYearAccentColor),
            this.rgbColorBuilder(this.data.previousYearAccentColor)
        );

        await this.hideLoading();
    }

    private async storeImageInGallery() {
        await this.showLoading();
        const chartCanvas = this.saleschartcomponent.chartCanvas.nativeElement;

        const success = await this.chartShareService.storeChartImageOnDeviceGallery(
            chartCanvas,
            this.selectedChartBundleLocalizedTitles,
            this.data.companyKey,
            this.dataDate,
            this.selectedChartBundlePeriodType,
            this.valueType,
            this.selectedChartBundleIsTimeChart,
            this.selectedPeriod.period,
            this.extraInfoValue,
            this.salesChartCurrentData,
            this.salesTableCurrentData,
            this.rgbColorBuilder(this.data.currentYearAccentColor),
            this.rgbColorBuilder(this.data.previousYearAccentColor)
        );

        await this.hideLoading();

        const messageKey = `SALES_CHARTS.SALES_CHARTS_COMPONENT.SHARE_SAVED_IMAGE_TO_GALLERY_${success ? 'SUCCESS' : 'ERROR'}`;

        const message = await this.translate.get(messageKey).toPromise();
        const okButton = await this.translate.get('SHARED.ALERTS.OK').toPromise();

        const alert = await this.alertController.create({
            header: '',
            message: message,
            buttons: [okButton]
        });

        await alert.present();
    }

    private rgbColorBuilder(color: { r: number, g: number, b: number }, alpha: number = 1): string {
        return `rgba(${color.r},${color.g},${color.b}, ${alpha})`;
    }

    private async showLoading(): Promise<void> {
        if (this.loading) {
            return;
        }

        this.loading = await this.loadingController.create();

        return await this.loading.present();
    }

    protected async hideLoading(): Promise<void> {

        if (!this.loading) {
            return;
        }

        await this.loading.dismiss();
        this.loading = null;
    }
}

