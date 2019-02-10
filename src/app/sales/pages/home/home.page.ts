import {
    Component,
    ViewChild,
    OnInit,
    OnDestroy
} from '@angular/core';

import {
    CurrencyPipe
} from '@angular/common';

import {
    PopoverController,
    LoadingController
} from '@ionic/angular';

import {
    CompanySelectorComponent,
    FooterTabMenu,
    FooterMenuItemSelectedEvent,
    FooterTabMenuItem
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
    Serie
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
    selectedChartBundlePeriodType: 'M' | 'W';
    selectedChartBundleLocalizedTitles: { [key: string]: string };
    selectedChartBundleIsTimeChart: boolean;
    extraInfoValue: string;

    selectedPeriod: string;

    showTimeFrameSelector: boolean;

    @ViewChild('chartCanvas') chartCanvas;

    timeFrame: 'monthly' | 'quarter';
    valueType: 'abs' | 'accum';
    viewType: 'chart' | 'table';

    footerTabMenus: FooterTabMenu[];

    public dataDate: Date;

    constructor(
        public popoverController: PopoverController,
        public loadingController: LoadingController,
        private salesService: SalesService,
        private salesSettingsService: SalesSettingsService,
        private localeService: LocaleService,
        private localeCurrencyPipe: LocaleCurrencyPipe,
        private translate: TranslateService,
        private chartShareService: ChartShareService
    ) {

        super(loadingController);

        this.dataDate = new Date();
        this.timeFrame = 'monthly';
        this.valueType = 'abs';
        this.viewType = 'chart';
        this.showTimeFrameSelector = true;
        this.selectedPeriod = '1';
    }

    async ngOnInit() {

        await this.showLoading();

        // get sales charts
        this.salesCharts = await this.salesService.getSalesCharts();

        // extract info from all companies
        this.companies = this.salesCharts.data.map(cs => ({ key: cs.key, name: cs.name }));

        // by default, select the first company
        this.selectedCompanySales = this.salesCharts.data[0];

        // by default, select the first chart bundle key
        this.selectedChartBundleKey = this.selectedCompanySales.chartBundle[0].key;

        // update view
        this.updateView();

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

    async companySelectorAction(event: any) {
        const popover = await this.popoverController.create({
            component: CompanySelectorComponent,
            componentProps: {
                companies: this.companies
            },
            event: event,
            translucent: true
        });

        return await popover.present();
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

        this.showTimeFrameSelector = chartBundle.isTimeChart && chartBundle.periodType === 'M';

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
                icon: '../../../../assets/sales/footer-menu-charts.png',
                items: chartItems
            },
            {
                key: 'salesperson',
                icon: '../../../../assets/sales/footer-menu-salesperson.png',
                disabledIcon: '../../../../assets/sales/footer-menu-salesperson-disabled.png',
                items: salesPersonItems
            },
            {
                key: 'share',
                icon: '../../../../assets/sales/footer-menu-share.png',
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
        const chartCanvas = document.getElementsByTagName('canvas')[0];

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
        const chartCanvas = document.getElementsByTagName('canvas')[0];

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

        const chartCanvas = document.getElementsByTagName('canvas')[0];

        await this.chartShareService.storeChartImageOnDeviceGallery(
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

        // return;

        // const canvas = document.createElement('canvas');
        // canvas.width = 2500;

        // if (this.selectedChartBundlePeriodType === 'M') {
        //     if (this.selectedChartBundleIsTimeChart) {
        //         canvas.height = 1500; // monthly chart
        //     } else {
        //         canvas.height = 1800; // top 5 charts
        //     }
        // } else {
        //     canvas.height = 7600; // weekly chart
        // }

        // const ctx = canvas.getContext('2d');

        // // default definitions
        // ctx.textBaseline = 'top';

        // // reference lines
        // // ctx.strokeRect(80, 80, 2500 - 80 * 2, 2500 - 80 * 2);
        // // ctx.strokeRect(2500 * .5, 0, 1, 2500);

        // // title
        // const chartName = this.localizedStringsPipe.transform(this.selectedChartBundleLocalizedTitles).toUpperCase();
        // const aggregationResourceKey = this.valueType === 'abs' ? 'SALES.SHARE_CHARTS.ABSOLUTE' : 'SALES.SHARE_CHARTS.ACCUMULATED';
        // const aggregation = await this.translate.get(aggregationResourceKey).toPromise();
        // let period = '';

        // if (!this.selectedChartBundleIsTimeChart) {
        //     period = await this.translate.get(`SHARED.DATES.MONTHS.${this.selectedPeriod}`).toPromise();
        //     period = `(${period.slice(0, 3).toLocaleLowerCase()}) `;
        // }

        // const title = `${chartName} ${period}- ${aggregation}`;
        // ctx.font = 'bold 50px Open Sans Condensed';
        // ctx.fillStyle = '#000';
        // ctx.fillText(title, 100, 100);

        // // COMPANY
        // const companyKey = this.selectedCompanySales.key;
        // ctx.font = '50px Open Sans Condensed';
        // ctx.fillStyle = '#1C307D';
        // ctx.fillText(companyKey, 100, 180);

        // // DATE
        // const date = this.datePipe.transform(this.dataDate, 'medium');
        // ctx.font = '50px Open Sans Condensed';
        // ctx.fillStyle = '#000';
        // ctx.fillText(date, 100, 260);

        // // CHARTS
        // const chartPosX = 170;
        // const chartPosY = 500;
        // let chartHeight: number;
        // const charCanvas = document.getElementsByTagName('canvas')[0];
        // charCanvas.getContext('2d').strokeRect(0, 0, charCanvas.width - 1, charCanvas.height - 1);

        // if (this.selectedChartBundlePeriodType === 'W') {
        //     chartHeight = 1020;
        //     const chartWidth = ((charCanvas.width * 1020) / charCanvas.height);
        //     const chartMargin = {
        //         top: 115,
        //         right: 0,
        //         bottom: 115,
        //         left: 50
        //     };

        //     const tempCanvas = document.createElement('canvas');
        //     tempCanvas.height = chartHeight + chartMargin.top + chartMargin.bottom;
        //     tempCanvas.width = chartWidth + chartMargin.left + chartMargin.right;
        //     const tempCtx = tempCanvas.getContext('2d');
        //     tempCtx.textBaseline = 'top';

        //     tempCtx.drawImage(charCanvas, chartMargin.left, chartMargin.top, tempCanvas.width, chartHeight);

        //     // CHART SERIES LEGEND
        //     tempCtx.font = '40px Open Sans Condensed';
        //     // current year
        //     tempCtx.fillStyle = '#000';
        //     tempCtx.fillText(this.salesChartCurrentData.currentYearLegend, tempCanvas.width - 30 - 80 - 140, 0);
        //     tempCtx.fillStyle = '#1C307D';
        //     tempCtx.fillRect(tempCanvas.width - 30 - 140, 0, 30, 30);

        //     // previouse year
        //     tempCtx.fillStyle = '#000';
        //     tempCtx.fillText(this.salesChartCurrentData.previousYearLegend, tempCanvas.width - 30 - 80, 0);
        //     tempCtx.fillStyle = '#DBE0EB';
        //     tempCtx.fillRect(tempCanvas.width - 30, 0, 30, 30);

        //     // y axis
        //     // 0.0682 => percentual height of legend + top chart margin
        //     const stepDelta = ((chartHeight - chartHeight * 0.0682) / 4) - 1;

        //     // 0.0124 => percentual height of top chart margin
        //     // 115 => chart padding
        //     const stepCompensation = chartHeight * 0.0124 + chartMargin.top;
        //     tempCtx.fillStyle = '#000';
        //     tempCtx.fillRect(chartMargin.left, stepDelta * 0 + stepCompensation, chartWidth, 1);
        //     tempCtx.fillRect(chartMargin.left, stepDelta * 1 + stepCompensation, chartWidth, 1);
        //     tempCtx.fillRect(chartMargin.left, stepDelta * 2 + stepCompensation, chartWidth, 1);
        //     tempCtx.fillRect(chartMargin.left, stepDelta * 3 + stepCompensation, chartWidth, 1);

        //     tempCtx.font = 'bold 30px Open Sans Condensed';
        //     tempCtx.textAlign = 'right';
        //     tempCtx.textBaseline = 'middle';
        //     const yAxisScaleYConstant = stepCompensation;
        //     const scaleStep = this.salesChartCurrentData.yAxisScaleStep;
        //     tempCtx.fillText(`${scaleStep * 4}`, chartMargin.left - 5, yAxisScaleYConstant + stepDelta * 0);
        //     tempCtx.fillText(`${scaleStep * 3}`, chartMargin.left - 5, yAxisScaleYConstant + stepDelta * 1);
        //     tempCtx.fillText(`${scaleStep * 2}`, chartMargin.left - 5, yAxisScaleYConstant + stepDelta * 2);
        //     tempCtx.fillText(`${scaleStep * 1}`, chartMargin.left - 5, yAxisScaleYConstant + stepDelta * 3);

        //     // y axis units
        //     // rotate 90deg
        //     tempCtx.save();
        //     tempCtx.translate(30, 50);
        //     tempCtx.rotate(-Math.PI / 2);
        //     tempCtx.textAlign = 'center';
        //     const currencySymbol = this.currencySymbolPipe.transform(this.salesChartCurrentData.currentCurrency);
        //     tempCtx.fillText(`${this.salesChartCurrentData.yAxisScaleUnitPrefix}(${currencySymbol})`, 0, 0);
        //     tempCtx.restore();

        //     // this.imgSrc = tempCanvas.toDataURL();

        //     ctx.save();
        //     // ctx.translate(tempCanvas.height, 400);
        //     ctx.translate(1250, 400);
        //     ctx.rotate(Math.PI / 2);
        //     ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height);
        //     ctx.restore();

        //     chartHeight = tempCanvas.width;
        // } else {
        //     // CHART SERIES LEGEND
        //     ctx.font = '40px Open Sans Condensed';
        //     // current year
        //     ctx.fillStyle = '#000';
        //     ctx.fillText(this.salesChartCurrentData.currentYearLegend, 935, 400);
        //     ctx.fillStyle = '#1C307D';
        //     ctx.fillRect(1010, 400, 30, 30);

        //     // previouse year
        //     ctx.fillStyle = '#000';
        //     ctx.fillText(this.salesChartCurrentData.previousYearLegend, 1070, 400);
        //     ctx.fillStyle = '#DBE0EB';
        //     ctx.fillRect(1150, 400, 30, 30);

        //     // draw chart
        //     chartHeight = (charCanvas.height * 1020) / charCanvas.width;
        //     ctx.drawImage(charCanvas, chartPosX, chartPosY, 1020, chartHeight);

        //     // draw scale
        //     // 0.0682 => percentual height of legend + top chart margin
        //     const stepDelta = (chartHeight - chartHeight * 0.0682) / 4;

        //     // 0.0124 => percentual height of top chart margin
        //     const stepCompensation = chartHeight * 0.0124;

        //     ctx.fillStyle = '#000';
        //     ctx.fillRect(chartPosX, chartPosY + stepDelta * 0 + stepCompensation, 1020, 1);
        //     ctx.fillRect(chartPosX, chartPosY + stepDelta * 1 + stepCompensation, 1020, 1);
        //     ctx.fillRect(chartPosX, chartPosY + stepDelta * 2 + stepCompensation, 1020, 1);
        //     ctx.fillRect(chartPosX, chartPosY + stepDelta * 3 + stepCompensation, 1020, 1);
        //     ctx.fillRect(chartPosX, chartPosY + stepDelta * 4 + stepCompensation, 1020, 1);

        //     ctx.font = 'bold 30px Open Sans Condensed';
        //     ctx.textAlign = 'right';
        //     const yAxisScaleYConstant =  chartPosY + stepCompensation - 5;
        //     ctx.fillText(`${this.salesChartCurrentData.yAxisScaleStep * 4}`, chartPosX - 20, yAxisScaleYConstant + stepDelta * 0);
        //     ctx.fillText(`${this.salesChartCurrentData.yAxisScaleStep * 3}`, chartPosX - 20, yAxisScaleYConstant + stepDelta * 1);
        //     ctx.fillText(`${this.salesChartCurrentData.yAxisScaleStep * 2}`, chartPosX - 20, yAxisScaleYConstant + stepDelta * 2);
        //     ctx.fillText(`${this.salesChartCurrentData.yAxisScaleStep * 1}`, chartPosX - 20, yAxisScaleYConstant + stepDelta * 3);

        //     // y axis units
        //     // rotate 90deg
        //     ctx.save();
        //     ctx.translate(chartPosX - 50, chartPosY - 70);
        //     ctx.rotate(-Math.PI / 2);
        //     ctx.textAlign = 'center';
        //     const currencySymbol = this.currencySymbolPipe.transform(this.salesChartCurrentData.currentCurrency);
        //     ctx.fillText(`${this.salesChartCurrentData.yAxisScaleUnitPrefix}(${currencySymbol})`, 0, 0);
        //     ctx.restore();


        // }

        // // chart extra  info
        // ctx.font = '40px Open Sans Condensed';
        // ctx.textAlign = 'center';
        // ctx.fillText(this.extraInfoValue, 625, chartPosY + chartHeight + 100);


        // // TABLE
        // // TABLE SERIES LEGEND

        // const padding = 1180;
        // ctx.font = '40px Open Sans Condensed';
        // ctx.textAlign = 'left';
        // // current year
        // ctx.fillStyle = '#000';
        // ctx.fillText(this.salesTableCurrentData.currentYearLabel, 2120, 400);
        // ctx.fillStyle = '#1C307D';
        // ctx.fillRect(2196, 400, 30, 30);

        // // previouse year
        // ctx.fillStyle = '#000';
        // ctx.fillText(this.salesTableCurrentData.previouseYearLabel, 2250, 400);
        // ctx.fillStyle = '#DBE0EB';
        // ctx.fillRect(2330, 400, 30, 30);

        // // DRAW TABLE
        // ctx.fillStyle = '#000';
        // ctx.font = '30px Open Sans Condensed';
        // const rowHeight = 50;
        // const tableInitialPosition = 500;
        // let tableRowYPosition = tableInitialPosition;

        // let isFirstRow = true;
        // for (const rowData of this.salesTableCurrentData.rows) {
        //     if (rowData.isTotal) {
        //         ctx.font = 'bold 30px Open Sans Condensed';
        //     }

        //     // bottom line
        //     if (!isFirstRow) {
        //         ctx.fillStyle = '#000';
        //         ctx.fillRect(1350, tableRowYPosition - 15, 1020, 1);
        //     }
        //     isFirstRow = false;

        //     // legend
        //     ctx.fillStyle = 'gray';
        //     ctx.textAlign = 'left';
        //     ctx.fillText(rowData.label, 1350, tableRowYPosition);

        //     // curre
        //     const currentValue = this.currencyPipe.transform(rowData.currentYearValue, this.salesTableCurrentData.currency);
        //     ctx.textAlign = 'right';
        //     ctx.fillStyle = 'blue';
        //     ctx.fillText(currentValue, 1850, tableRowYPosition);
        //     // prev
        //     const prevValue = this.currencyPipe.transform(rowData.previousYearValue, this.salesTableCurrentData.currency);
        //     ctx.fillStyle = 'gray';
        //     ctx.fillText(prevValue, 2250, tableRowYPosition);
        //     // delta
        //     ctx.fillStyle = rowData.deltaPercentageValue >= 0 ? 'green' : 'red';
        //     ctx.fillText(`${Math.round(rowData.deltaPercentageValue)}%`, 2370, tableRowYPosition);

        //     tableRowYPosition += rowHeight;
        // }

        // // table extra info
        // ctx.fillStyle = '#000';
        // ctx.font = '40px Open Sans Condensed';
        // ctx.textAlign = 'center';
        // ctx.fillText(this.extraInfoValue, 1875, tableRowYPosition + 100);

        // // LEGEND
        // if (!this.selectedChartBundleIsTimeChart) {
        //     ctx.fillStyle = '#000';
        //     ctx.font = '40px Open Sans Condensed';
        //     ctx.textAlign = 'left';
        //     let legendYPosition = chartPosY + chartHeight + 200;
        //     for (const rowData of this.salesTableCurrentData.rows) {
        //         if (!rowData.isTotal) {
        //             ctx.fillText(`${rowData.label} - ${rowData.description}`, 100, legendYPosition);
        //             legendYPosition += 45;
        //         }
        //     }
        // }

        // const imgSrc = canvas.toDataURL();
    }
}
