
import {
    Component,
    HostListener,
    ElementRef,
    ViewChild,
    OnInit,
    OnDestroy,
    Input
} from '@angular/core';
import { SalesDataCharts, ChartBundle, Serie, ChartData, ChartPeriodType } from '../../entities';
import { Subscription } from 'rxjs';
import { LocaleService } from '../../../core/services';
import { ActivatedRoute } from '@angular/router';
import { AlertController, IonNav } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LocaleCurrencyPipe } from '../../../shared/pipes';
import { FooterTabMenuItem, FooterTabMenu, FooterMenuItemSelectedEvent } from '../footer-menu';
import { SalesTableData, SalesTableUpdatedEvent } from '../sales-table/entities';
import { SalesChartData, SalesChartUpdatedEvent } from '../sales-chart/entities';
import { SalesChartComponent } from '../sales-chart/sales-chart.component';
import { ChartShareService } from '../../services';
import { SalesChartsData } from './sales-charts-data';

@Component({
    selector: 'sales-charts',
    templateUrl: 'sales-charts.component.html',
    styleUrls: ['sales-charts.component.scss']
})
export class SalesChartsComponent implements OnInit, OnDestroy {
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

    selectedPeriod: string;

    showTimeFrameSelector: boolean;

    timeFrame: 'monthly' | 'quarter';
    valueType: 'abs' | 'accum';
    viewType: 'chart' | 'table';

    footerTabMenus: FooterTabMenu[];
    dataDate: Date;

    @ViewChild('saleschart') saleschartcomponent: SalesChartComponent;

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
        private chartShareService: ChartShareService
    ) {
        this.dataDate = new Date();
        this.timeFrame = 'monthly';
        this.valueType = 'abs';
        this.viewType = 'chart';
        this.showTimeFrameSelector = true;
        this.selectedPeriod = '1';
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

    private async updateView() {

        if (!this.data || !this.data.chartBundles) {
            return;
        }


        // update dynamic colors
        const root = document.documentElement;
        root.style.setProperty('--sales-charts-accent-color', this.rgbColorBuilder(this.data.accentColor));
        root.style.setProperty('--sales-charts-current-year-accent-color', this.rgbColorBuilder(this.data.currentYearAccentColor));
        root.style.setProperty('--sales-charts-previous-year-accent-color', this.rgbColorBuilder(this.data.previousYearAccentColor));


        this.updateFooterMenu(this.data.chartBundles);

        const chartBundle = this.data.chartBundles.find(b => b.key === this.selectedChartBundleKey);
        this.selectedChartBundleLocalizedTitles = chartBundle.titles;
        this.selectedChartBundleIsTimeChart = chartBundle.isTimeChart;
        this.selectedChartBundlePeriodType = chartBundle.periodType;

        const currency = this.data.useReportingValue ? chartBundle.reportingCurrency : chartBundle.currency;
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
            useReportingValue: this.data.useReportingValue,
            previousYearSerie: previousYearSerie,
            currentYearSerie: currentYearSerie,
            currentYearAccentColor: this.rgbColorBuilder(this.data.currentYearAccentColor),
            currentYearAccentColorWithTransparency: this.rgbColorBuilder(this.data.currentYearAccentColor, .5),
            previouseYearAccentColor: this.rgbColorBuilder(this.data.previousYearAccentColor),
            previouseYearAccentColorWithTransparency: this.rgbColorBuilder(this.data.currentYearAccentColor, .5)
        };

        // table data
        this.tableData = {
            chartBundle: chartBundle,
            chart: chart,
            timeFrame: this.timeFrame,
            period: this.selectedPeriod,
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
            const dataSet = chart.dataSet.find(ds => ds.period === this.selectedPeriod);
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

    private updateFooterMenu(chartBundle: ChartBundle[]) {

        if (!chartBundle || chartBundle.length === 0) {
            return;
        }

        const currentLanguage = this.localeService.language;

        const chartItems = chartBundle.map(cb => ({
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
                        label: '#Send chart by email'
                    },
                    {
                        key: 'send_pdf_chart_by_email',
                        label: '#Send PDF chart by email'
                    },
                    {
                        key: 'save_image_in_the_gallery',
                        label: '#Save Image in the gallery'
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
            this.data.companyKey,
            this.dataDate,
            this.selectedChartBundlePeriodType,
            this.valueType,
            this.selectedChartBundleIsTimeChart,
            this.selectedPeriod,
            this.extraInfoValue,
            this.salesChartCurrentData,
            this.salesTableCurrentData,
            this.rgbColorBuilder(this.data.currentYearAccentColor),
            this.rgbColorBuilder(this.data.previousYearAccentColor)
        );
    }

    private async shareChartPdfByEmail() {
        const chartCanvas = this.saleschartcomponent.chartCanvas.nativeElement;

        await this.chartShareService.shareChartPdfByEmail(
            chartCanvas,
            this.selectedChartBundleLocalizedTitles,
            this.data.companyKey,
            this.dataDate,
            this.selectedChartBundlePeriodType,
            this.valueType,
            this.selectedChartBundleIsTimeChart,
            this.selectedPeriod,
            this.extraInfoValue,
            this.salesChartCurrentData,
            this.salesTableCurrentData,
            this.rgbColorBuilder(this.data.currentYearAccentColor),
            this.rgbColorBuilder(this.data.previousYearAccentColor)
        );
    }

    private async storeImageInGallery() {

        const chartCanvas = this.saleschartcomponent.chartCanvas.nativeElement;

        const success = await this.chartShareService.storeChartImageOnDeviceGallery(
            chartCanvas,
            this.selectedChartBundleLocalizedTitles,
            this.data.companyKey,
            this.dataDate,
            this.selectedChartBundlePeriodType,
            this.valueType,
            this.selectedChartBundleIsTimeChart,
            this.selectedPeriod,
            this.extraInfoValue,
            this.salesChartCurrentData,
            this.salesTableCurrentData,
            this.rgbColorBuilder(this.data.currentYearAccentColor),
            this.rgbColorBuilder(this.data.previousYearAccentColor)
        );

        const message = success ? '#image stored with success' : '# not possible to store the image';

        const alert = await this.alertController.create({
            header: '',
            message: message,
            buttons: ['OK']
        });

        await alert.present();
    }

    private rgbColorBuilder(color: {r: number, g: number, b: number}, alpha: number = 1): string {
        return `rgba(${color.r},${color.g},${color.b}, ${alpha})`;
    }
}

