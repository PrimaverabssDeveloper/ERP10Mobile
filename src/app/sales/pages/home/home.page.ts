import {
    Component,
    ViewChild,
    OnInit
} from '@angular/core';

import {
    CurrencyPipe, DatePipe
} from '@angular/common';

import {
    PopoverController,
    LoadingController
} from '@ionic/angular';

import {
    CompanySelectorComponent,
    FooterTabMenu,
    FooterMenuItemSelectedEvent,
    FooterTabMenuItem,
    SalesTableComponent
} from '../../components';

import {
    PageBase
} from '../../../shared/pages';

import {
    SalesService,
    SalesServiceProvider
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
    LocaleService,
    DomService
} from '../../../core/services';

import { LocalizedStringsPipe } from '../../../shared/pipes';



@Component({
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    providers: [SalesServiceProvider]
})
export class HomePage extends PageBase implements OnInit {

    private readonly currentYearAccentColor = 'rgb(29, 49, 125)';
    private readonly previouseYearAccentColor = 'rgb(219, 224, 235)';
    private readonly currentYearAccentColorWithTransparency = 'rgba(29, 49, 125, .5)'; // it has to be in RGBA not HEX
    private readonly previouseYearAccentColorWithTransparency = 'rgba(219, 224, 235, .5)'; // it has to be in RGBA not HEX
    private readonly currentYearSeriesKey = '1';
    private readonly previousYearSeriesKey = '0';

    private companies: Company[];
    private salesCharts: SalesCharts;

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
        private localeService: LocaleService,
        private currencyPipe: CurrencyPipe,
        private datePipe: DatePipe,
        private domService: DomService
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

        this.hideLoading();

        // setTimeout(() => this.storeImageInGallery(), 1000);
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

    private updateView() {

        this.updateFooterMenu(this.selectedCompanySales);

        const chartBundle = this.selectedCompanySales.chartBundle.find(b => b.key === this.selectedChartBundleKey);
        this.selectedChartBundleLocalizedTitles = chartBundle.titles;
        this.selectedChartBundleIsTimeChart = chartBundle.isTimeChart;
        this.selectedChartBundlePeriodType = chartBundle.periodType;

        const useReportingValue = false;
        const currency = useReportingValue ? chartBundle.reportingCurrency : chartBundle.currency;
        const chart = chartBundle.charts.find(c => c.valueType === this.valueType);

        const currentYearSerie = this.getSerieWithKey(chartBundle.series, this.currentYearSeriesKey);
        const previousYearSerie = this.getSerieWithKey(chartBundle.series, this.previousYearSeriesKey);

        if (this.viewType === 'chart') {
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
        } else {
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
        }

        this.showTimeFrameSelector = chartBundle.isTimeChart && chartBundle.periodType === 'M';

        // extra info
        this.extraInfoValue = '';
        if (chartBundle.isTimeChart) {
            const totalDataSet = chart.dataSet.find(ds => ds.hasTotal);
            if (totalDataSet) {
                const totalDataPoint = totalDataSet.dataPoints.find(dp => dp.isTotal);

                if (totalDataPoint) {
                    const value = this.getCorrectValue(totalDataPoint.values[1], useReportingValue);
                    const moneyValue = this.currencyPipe.transform(value, currency);
                    this.extraInfoValue = `#Total sales: ${moneyValue}`;
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
                    const moneyValue = this.currencyPipe.transform(otherValue, currency);
                    const ratioPercentage = this.calcPercentageRatioBetweenTwoNumbers(otherValue, otherValue + totalValue, true);
                    const rationString = ratioPercentage === 0 ? 'N/A' : `${ratioPercentage}%`;
                    this.extraInfoValue = `#Others: ${moneyValue} // ${rationString}`;
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

    // tslint:disable-next-line:member-ordering
    private body: any;
    private shareChartImageByEmail() {
        // https://stackoverflow.com/questions/10721884/render-html-to-an-image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.height = 100;

        const tempImg = document.createElement('img');
        tempImg.addEventListener('load', onTempImageLoad);

        const html = this.domService.createComponent(SalesTableComponent, { data: this.tableData }).innerHTML;

        // tslint:disable-next-line:max-line-length
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000"><foreignObject width="100%" height="100%">${html}</foreignObject></svg>`;
        tempImg.src = 'data:image/svg+xml,' + encodeURIComponent(svg);

        function onTempImageLoad(e) {
            ctx.drawImage(e.target, 0, 0);
            const base64 = canvas.toDataURL();
        }
    }

    private shareChartPdfByEmail() {

    }

    // tslint:disable-next-line:member-ordering
    imgSrc: string;

    private storeImageInGallery() {
        const canvas = document.createElement('canvas');
        canvas.width = 2500;
        canvas.height = 2500;
        const ctx = canvas.getContext('2d');

        // default definitions
        ctx.textBaseline = 'top';

        // reference lines
        ctx.strokeRect(80, 80, 2500 - 80 * 2, 2500 - 80 * 2);
        ctx.strokeRect(2500 * .5, 0, 1, 2500);

        // title
        const title = this.selectedChartBundleLocalizedTitles['pt'].toUpperCase();
        ctx.font = 'bold 50px Open Sans Condensed';
        ctx.fillStyle = '#000';
        ctx.fillText(title, 100, 100);

        // COMPANY
        const companyKey = this.selectedCompanySales.key;
        ctx.font = '50px Open Sans Condensed';
        ctx.fillStyle = '#1C307D';
        ctx.fillText(companyKey, 100, 180);

        // DATE
        const date = this.datePipe.transform(this.dataDate, 'medium');
        ctx.font = '50px Open Sans Condensed';
        ctx.fillStyle = '#000';
        ctx.fillText(date, 100, 260);






        // CHARTS
        // CHART SERIES LEGEND

        // current year
        ctx.fillStyle = '#000';
        ctx.fillText('0000', 890, 400);
        ctx.fillStyle = '#1C307D';
        ctx.fillRect(980, 400, 40, 40);

        // previouse year
        ctx.fillStyle = '#000';
        ctx.fillText('0000', 1060, 400);
        ctx.fillStyle = '#DBE0EB';
        ctx.fillRect(1150, 400, 40, 40);

        // draw chart
        const charCanvas = document.getElementsByTagName('canvas')[0];
        charCanvas.getContext('2d').strokeRect(0, 0, charCanvas.width - 1, charCanvas.height - 1 );
        const chartPosX = 170;
        const chartPosY = 500;
        const chartHeight = (charCanvas.height * 1020) / charCanvas.width;
        ctx.drawImage(charCanvas, chartPosX, chartPosY, 1020, chartHeight);

        // draw scale
        // 0.0682 => percentual height of legend + top chart margin
        const stepDelta = (chartHeight - chartHeight * 0.0682) / 4;

        // 0.0124 => percentual height of top chart margin
        const stepCompensation = chartHeight * 0.0124;

        ctx.fillStyle = '#000';
        ctx.fillRect(chartPosX, chartPosY + stepDelta * 0 + stepCompensation, 1020, 1);
        ctx.fillRect(chartPosX, chartPosY + stepDelta * 1 + stepCompensation, 1020, 1);
        ctx.fillRect(chartPosX, chartPosY + stepDelta * 2 + stepCompensation, 1020, 1);
        ctx.fillRect(chartPosX, chartPosY + stepDelta * 3 + stepCompensation, 1020, 1);
        ctx.fillRect(chartPosX, chartPosY + stepDelta * 4 + stepCompensation, 1020, 1);

        ctx.font = 'bold 30px Open Sans Condensed';
        ctx.textAlign = 'right';
        ctx.fillText('00', chartPosX - 20, chartPosY + stepDelta * 0 + stepCompensation - 5);
        ctx.fillText('0',  chartPosX - 20, chartPosY + stepDelta * 1 + stepCompensation - 5);
        ctx.fillText('00', chartPosX - 20, chartPosY + stepDelta * 2 + stepCompensation - 5);
        ctx.fillText('0',  chartPosX - 20, chartPosY + stepDelta * 3 + stepCompensation - 5);

        // rotate 90deg
        ctx.save();
        ctx.translate(chartPosX - 50, chartPosY - 70);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.fillText('M(_$)', 0, 0);
        ctx.restore();

        // chart extra  info
        ctx.font = '50px Open Sans Condensed';
        ctx.textAlign = 'center';
        ctx.fillText('#Total Sales xxxxx', 625, chartPosY + chartHeight + 100);


        // TABLE
        // TABLE SERIES LEGEND

        const padding = 1180;
        ctx.textAlign = 'left';
        // current year
        ctx.fillStyle = '#000';
        ctx.fillText('1000', 2080, 400);
        ctx.fillStyle = '#1C307D';
        ctx.fillRect(2166, 400, 40, 40);

        // previouse year
        ctx.fillStyle = '#000';
        ctx.fillText('0000', 2240, 400);
        ctx.fillStyle = '#DBE0EB';
        ctx.fillRect(2330, 400, 40, 40);

        // DRAW TABLE
        ctx.fillStyle = '#000';
        const rowHeight = 70;
        for (let row = 0; row < 12; row++) {
            ctx.fillStyle = 'gray';
            ctx.fillRect(1350, 450 + rowHeight + rowHeight * row - 5, 1020, 1);

            // legend
            ctx.textAlign = 'left';
            ctx.fillText(`${row}`, 1350, 450 + rowHeight * row);

            // prev
            ctx.textAlign = 'right';
            ctx.fillStyle = 'blue';
            ctx.fillText(`00000${row}`, 1850, 450 + rowHeight * row);
            // current
            ctx.fillStyle = 'gray';
            ctx.fillText(`00000${row}`, 2200, 450 + rowHeight * row);
            // delta
            ctx.fillStyle = 'green';
            ctx.fillText(`${row}%`, 2370, 450 + rowHeight * row);
        }

        this.imgSrc = canvas.toDataURL();
    }

    private calcYAxisMaxValueStepAndUnit(maximumValue: number, yAxisNumberOfSteps: number, yAxisMaxValues: number[])
        : { yAxisMaxValue: number, yAxisScaleStep: number, yAxisScaleUnitPrefix: string } {

        let divider = 1;
        const thousandDecimal = 1000;

        while (!((maximumValue / divider) < thousandDecimal)) {
            divider *= 1000;
        }

        const baseMaximum = maximumValue / divider;

        let scaleMaximum: number = null;

        for (const possibleMaximum of yAxisMaxValues) {
            if (baseMaximum < possibleMaximum) {
                scaleMaximum = possibleMaximum;
                break;
            }
        }

        if (!scaleMaximum) {
            scaleMaximum = yAxisMaxValues[0];
            divider *= 1000;
        }

        let prefix = 'T';

        switch (divider) {
            case 1: prefix = ''; break;
            case 1000: prefix = 'K'; break;
            case 1000000: prefix = 'M'; break;
            case 1000000000: prefix = 'B'; break;
        }

        const yMaximumValue = scaleMaximum * divider;
        const yScaleStep = scaleMaximum / yAxisNumberOfSteps;

        return {
            yAxisMaxValue: yMaximumValue,
            yAxisScaleStep: yScaleStep,
            yAxisScaleUnitPrefix: prefix
        };
    }

    private lcm(x: number, y: number) {
        const l = Math.min(x, y);
        const h = Math.max(x, y);
        const m = l * h;

        for (let i = h; i < m; i += h) {
            if (i % l === 0) {
                return i;
            }
        }

        return m;
    }

    private getPossibleMaximumYValues(yAxisNumberOfSteps: number): number[] {

        let baseTicks = yAxisNumberOfSteps;
        let baseLcm = this.lcm(yAxisNumberOfSteps, 10);

        while (baseTicks > 10) {
            baseTicks /= 10;
            baseLcm /= 10;
        }

        let limitTicks = baseTicks * 10;

        let limitLcm = 1;
        while (limitLcm < limitTicks) {
            limitLcm *= 10;
        }


        let mode = true;
        let value = baseTicks;
        const values: number[] = [];

        while (value < 10000) {

            if (value < 10 && value + baseTicks < 10) {
                value += baseTicks;
                continue;
            }

            if (mode) {

                value += baseTicks;
                if (value >= limitTicks) {
                    mode = false;
                    baseTicks *= 10;
                    limitTicks *= 10;
                }

            } else {

                value += baseLcm;
                if (value >= limitLcm && (value % baseTicks === 0)) {
                    mode = true;
                    baseLcm *= 10;
                    limitLcm *= 10;
                }

            }

            if (value < 10000) {
                const dividend = value;
                const divisor = 10;
                values.push(dividend / divisor);
            }
        }

        return values;
    }
}
