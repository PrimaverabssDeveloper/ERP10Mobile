import { Component, ViewChild, OnInit, HostListener } from '@angular/core';

import { Chart } from 'chart.js';
import { PopoverController, LoadingController } from '@ionic/angular';
import { CompanySelectorComponent, FooterTabMenu, FooterMenuItemSelectedEvent } from '../../components';
import { PageBase } from '../../../shared/pages';
import { SalesService, SalesServiceProvider } from '../../services';
import { Company, SalesCharts, CompanySales, ChartBundle, ChartData, Serie } from '../../entities';
import { LocaleService } from '../../../core/services';
import { CurrencyPipe } from '@angular/common';

@Component({
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    providers: [SalesServiceProvider]
})
export class HomePage extends PageBase implements OnInit {

    private readonly yAxisNumberOfSteps = 4;
    private readonly currentYearAccentColor = 'rgb(29, 49, 125)';
    private readonly previouseYearAccentColor = 'rgb(219, 224, 235)';
    private readonly currentYearAccentColorWithTransparency = 'rgba(29, 49, 125, .5)'; // it has to be in RGBA not HEX
    private readonly previouseYearAccentColorWithTransparency = 'rgba(219, 224, 235, .5)'; // it has to be in RGBA not HEX
    private readonly currentYearSeriesKey = '1';
    private readonly previousYearSeriesKey = '0';


    private chart: any;
    private companies: Company[];
    private salesCharts: SalesCharts;
    private yAxisMaxValues: number[];
    private touchDownWithoutMovement: boolean;

    tableData: {
        chart: ChartData,
        previousYearSerie: Serie,
        currentYearSerie: Serie,
        useReportingValue: boolean,
        currency: string
    };

    chartData: {
        chartBundle: ChartBundle,
        chart: ChartData,
        period: string,
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

    yAxisScaleStep: number;
    yAxisScaleUnitPrefix: string;

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
        private currencyPipe: CurrencyPipe
    ) {

        super(loadingController);

        this.dataDate = new Date();
        this.timeFrame = 'monthly';
        this.valueType = 'abs';
        this.viewType = 'chart';
        this.showTimeFrameSelector = true;
        this.selectedPeriod = '1';

        this.yAxisMaxValues = this.getPossibleMaximumYValues(this.yAxisNumberOfSteps);
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
            // for (const menuItem of event.menu.items) {
            //     menuItem.selected = menuItem === event.menuItem;
            // }
        } else {
            this.selectedChartBundleKey = event.menuItem.key;
            this.updateView();
        }
    }

    onPeriodChanged(period: string) {
        this.selectedPeriod = period;
        this.updateView();
    }

    @HostListener('touchstart', ['$event'])
    onMouseDown(e: TouchEvent) {
        console.log('touchstart');
        this.touchDownWithoutMovement = true;
    }

    @HostListener('touchmove', ['$event'])
    onMouseMove(e: TouchEvent) {
        console.log('touchmove');
        this.touchDownWithoutMovement = false;
    }

    @HostListener('touchend', ['$event'])
    onMouseUp(e: TouchEvent) {
        console.log('touchend');
        this.touchDownWithoutMovement = false;
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

        // let data: {
        //     maxValue: number,
        //     labels: string[],
        //     dataSets: { label: string, backgroundColor: string, hoverBackgroundColor: string, data: number[] }[]
        // };

        // if (chartBundle.isTimeChart) {
        //     data = this.buildTimeChartData(chart, previousYearSerie, currentYearSerie, currency, this.valueType, useReportingCurrency);
        // } else {
        //     data = this.buildTopChartData(
        //         chart,
        //         chartBundle,
        //         previousYearSerie,
        //         currentYearSerie,
        //         this.selectedPeriod,
        //         currency,
        //         useReportingCurrency);
        // }

        if (this.viewType === 'chart') {
            this.chartData = {
                chart: chart,
                chartBundle: chartBundle,
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
                chart: chart,
                previousYearSerie: previousYearSerie,
                currentYearSerie: currentYearSerie,
                useReportingValue: useReportingValue,
                currency: currency
            };
        }

        // extra info

        // get chart total
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

    private updateChart(
        chartBundle: ChartBundle,
        valueType: 'abs' | 'accum',
        currency: string,
        data: {
            maxValue: number,
            labels: string[],
            dataSets: { label: string, backgroundColor: string, hoverBackgroundColor: string, data: number[] }[]
        }
    ) {

        // const currency = useReportingCurrency ? chartBundle.reportingCurrency : chartBundle.currency;
        // const chart = chartBundle.charts.find(c => c.valueType === valueType);
        const chartType = valueType === 'accum' && chartBundle.isTimeChart ? 'line' : 'bar';

        // this.currentCurrency = currency;

        // const currentYearSerie = this.getSerieWithKey(chartBundle.series, this.currentYearSeriesKey);
        // const previousYearSerie = this.getSerieWithKey(chartBundle.series, this.previousYearSeriesKey);

        // this.currentYearLegend = currentYearSerie ? currentYearSerie.legend : null;
        // this.previousYearLegend = previousYearSerie ? previousYearSerie.legend : null;

        // let data: {
        //     maxValue: number,
        //     labels: string[],
        //     dataSets: { label: string, backgroundColor: string, hoverBackgroundColor: string, data: number[] }[]
        // };

        // if (chartBundle.isTimeChart) {
        //     data = this.buildTimeChartData(chart, previousYearSerie, currentYearSerie, currency, valueType, useReportingCurrency);
        // } else {
        //     data = this.buildTopChartData(chart, chartBundle, previousYearSerie, currentYearSerie, period, currency, useReportingCurrency);
        // }

        // Y axis configurations
        const yAxisMaxValueStepAndUnit = this.calcYAxisMaxValueStepAndUnit(data.maxValue, this.yAxisNumberOfSteps, this.yAxisMaxValues);
        this.yAxisScaleStep = yAxisMaxValueStepAndUnit.yAxisScaleStep;
        this.yAxisScaleUnitPrefix = yAxisMaxValueStepAndUnit.yAxisScaleUnitPrefix;
        const yAxisMaxValue = yAxisMaxValueStepAndUnit.yAxisMaxValue;

        // if the chart change type, it needs to be created again
        if (this.chart && chartType !== this.chart.config.type) {
            this.chart.destroy();
            this.chart = null;
        }

        const customTooltip = (tooltipModel: any) => {
            // Tooltip Element
            let tooltipEl = document.getElementById('chartjs-tooltip') as any;

            // Create element on first render
            if (!tooltipEl) {
                tooltipEl = document.createElement('div');
                tooltipEl.id = 'chartjs-tooltip';
                document.body.appendChild(tooltipEl);
            }

            // Hide if no tooltip
            if (tooltipModel.opacity === 0) {
                tooltipEl.style.opacity = 0;
                return;
            }

            // Set caret Position
            tooltipEl.classList.remove('above', 'below', 'no-transform');
            if (tooltipModel.yAlign) {
                tooltipEl.classList.add(tooltipModel.yAlign);
            } else {
                tooltipEl.classList.add('no-transform');
            }

            const position = this.chart.canvas.getBoundingClientRect();
            const leftTooltipPos = position.left + window.pageXOffset + tooltipModel.caretX;
            const colIndex = tooltipModel.dataPoints[0].index;
            const label = data.labels[colIndex];
            const currentYearValue = data.dataSets[0].data[colIndex];
            const previousYearValue = data.dataSets[1].data[colIndex];
            const deltaValue = this.calcPercentageDeltaBetweenTwoNumbers(previousYearValue, currentYearValue, true);
            const accentColor = deltaValue >= 0 ? 'green' : 'red';

            const isLeftTooltip = leftTooltipPos + 100 < window.innerWidth;

            tooltipEl.innerHTML = `
            <div style="width:100%;
                        height: 100%;
                        font-weight:bold;
                        font-size:8pt;
                        line-height:12px;
                        transform:translateX(${isLeftTooltip ? 0 : -100}%)
                        ">
                <div style="float:left; width:200px">
                    <div style="
                        width:5px;
                        height:5px;
                        margin-top:3px;
                        margin-right:3px;
                        background-color:#1D317D;
                        float:left"></div>
                    <div style="float:left">${this.currencyPipe.transform(currentYearValue, currency)}</div>
                </div>
                <div style="float:left; width:200px">
                    <div style="
                        width:5px;
                        height:5px;
                        margin-top:3px;
                        margin-right:3px;
                        background-color:#DBE0EB;
                        float:left"></div>
                    <div style="float:left">${this.currencyPipe.transform(previousYearValue, currency)}</div>
                </div>
                <div style="float:left; width:100%; color:${accentColor}">Delta = ${deltaValue}%</div>
                <div style="border-left:${isLeftTooltip ? 1 : 0}px solid ${accentColor};
                            border-right:${isLeftTooltip ? 0 : 1}px solid ${accentColor};
                            border-top:1px solid ${accentColor};
                            float:left;
                            height: calc(100% - 45px);
                            width:100%;">
                    <div style="border:1px solid gray;
                                padding: 0 5px;
                                text-align: center;
                                left: 50%;
                                transform: translateX(-50%);
                                position: absolute;
                                margin-top: 2px;
                                font-weight: bold;
                                font-size: 8pt;">
                        ${label}
                    </div>
                </div>
            </div>`;

            // Display, position, and set styles for font
            tooltipEl.style.opacity = 0;
            tooltipEl.style.width = '90px';
            tooltipEl.style.height = `${58 + this.chartCanvas.nativeElement.clientHeight - 6 - 27}px`;

            tooltipEl.style.position = 'absolute';
            tooltipEl.style.left = leftTooltipPos + 'px';
            tooltipEl.style.top = '161px';
            tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
            tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
            tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
            tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
            tooltipEl.style.pointerEvents = 'none';

            const checkVisibility = () => {
                setTimeout(() => {
                    if (this.touchDownWithoutMovement) {
                        tooltipEl.style.opacity = 1;
                        checkVisibility();
                    } else {
                        tooltipEl.style.opacity = 0;
                    }
                }, 300);
            };

            checkVisibility();
        };

        // create or update the chart config
        if (this.chart) {

            this.chart.type = chartType;
            this.chart.data.labels = data.labels;
            this.chart.data.datasets = data.dataSets;
            this.chart.options.scales.yAxes[0].ticks.max = yAxisMaxValue;
            this.chart.options.tooltips.custom = customTooltip;
            this.chart.update();

        } else {

            this.chart = new Chart(this.chartCanvas.nativeElement, {
                type: chartType,
                data: {
                    labels: data.labels,
                    datasets: data.dataSets,
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    tooltips: {
                        enabled: false,
                        mode: 'x',
                        intersect: false,
                        custom: customTooltip
                    },
                    legend: {
                        display: false
                    },
                    scales: {
                        yAxes: [{
                            display: false,
                            ticks: {
                                beginAtZero: true,
                                maxTicksLimit: this.yAxisNumberOfSteps,
                                max: yAxisMaxValue
                            }
                        }],
                        xAxes: [
                            {
                                display: true,
                                gridLines: {
                                    display: false
                                }
                            }
                        ]
                    }
                }
            });

        }
    }

    private updateFooterMenu(companySales: CompanySales) {

        const currentLanguage = this.localeService.language;

        const chartItems = companySales.chartBundle.map(cb => ({
            key: cb.key,
            label: cb.titles[currentLanguage],
            selected: () => cb.key === this.selectedChartBundleKey
        }));

        this.footerTabMenus = [
            {
                key: 'charts',
                icon: '../../../../assets/sales/footer-menu-charts.png',
                items: chartItems
            },
            {
                key: 'salesperson',
                icon: '../../../../assets/sales/footer-menu-salesperson.png',
                items: [
                    {
                        key: 'sp1',
                        label: 'Sales Person 1'
                    },
                    {
                        key: 'sp2',
                        label: 'Sales Person 2'
                    }
                ]
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

    private accumulateValues(values: number[]): number[] {
        let accomulatedValue = 0;
        const accumulatedValues = [];
        for (let i = 0; i < values.length; i++) {
            accomulatedValue += values[i];
            accumulatedValues.push(accomulatedValue);
        }

        return accumulatedValues;
    }

    private aggregateValues(values: number[], amount: number) {
        const aggregatedValues = [];
        let aggregatedValue = 0;

        for (let i = 0; i < values.length; i++) {
            aggregatedValue += values[i];
            aggregatedValues.push(aggregatedValue);

            if (i % amount === 0) {
                aggregatedValues.push(aggregatedValue);
                aggregatedValue = 0;
            }
        }

        if (aggregatedValue !== 0) {
            aggregatedValues.push(aggregatedValue);
        }

        return aggregatedValues;
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

    private buildTimeChartData(
        chart: ChartData,
        previousYearSerie: Serie,
        currentYearSerie: Serie,
        currency: string,
        valueType: 'abs' | 'accum',
        useReportingValue: boolean)
        : {
            maxValue: number,
            labels: string[],
            dataSets: { label: string, backgroundColor: string, hoverBackgroundColor: string, data: number[] }[]
        } {

        // get chart total
        this.extraInfoValue = '';
        const totalDataSet = chart.dataSet.find(ds => ds.hasTotal);
        if (totalDataSet) {
            const totalDataPoint = totalDataSet.dataPoints.find(dp => dp.isTotal);

            if (totalDataPoint) {
                const value = this.getCorrectValue(totalDataPoint.values[1], useReportingValue);
                const moneyValue = this.currencyPipe.transform(value, currency);
                this.extraInfoValue = `#Total sales: ${moneyValue}`;
            }
        }

        const labels: string[] = [];
        const dataSets: { label: string, backgroundColor: string, hoverBackgroundColor, data: number[] }[] = [];
        let maxValue = 0;

        let currentYearAccentColor: string;
        let previouseYearAccentColor: string;
        if (valueType === 'abs') {
            currentYearAccentColor = this.currentYearAccentColor;
            previouseYearAccentColor = this.previouseYearAccentColor;
        } else {
            currentYearAccentColor = this.currentYearAccentColorWithTransparency;
            previouseYearAccentColor = this.previouseYearAccentColorWithTransparency;
        }


        // current year serie
        dataSets.push(
            {
                label: currentYearSerie.legend,
                data: [],
                backgroundColor: currentYearAccentColor,
                hoverBackgroundColor: currentYearAccentColor
            }
        );

        // previous year serie
        dataSets.push(
            {
                label: previousYearSerie.legend,
                data: [],
                backgroundColor: previouseYearAccentColor,
                hoverBackgroundColor: previouseYearAccentColor
            }
        );

        // right display order series
        const series = [currentYearSerie, previousYearSerie];

        for (const dataSet of chart.dataSet) {
            // the Monthly Chart has always only one set of datapoins
            const dataPoint = dataSet.dataPoints[0];

            // the dataPoint with total values is not used on the chart
            if (dataPoint.isTotal) {
                continue;
            }

            labels.push(dataPoint.label);

            for (let i = 0; i < series.length; i++) {
                const serie = series[i];
                const value = dataPoint.values.find(v => v.seriesKey === serie.key);
                let finalValue = 0;

                if (value) {
                    finalValue = this.getCorrectValue(value, useReportingValue);
                    maxValue = finalValue > maxValue ? finalValue : maxValue;
                }

                dataSets[i].data.push(finalValue);
            }
        }

        return {
            dataSets: dataSets,
            maxValue: maxValue,
            labels: labels
        };
    }

    private buildTopChartData(
        chart: ChartData,
        chartBundle: ChartBundle,
        previousYearSerie: Serie,
        currentYearSerie: Serie,
        period: string,
        currency: string,
        useReportingValue: boolean)
        : {
            maxValue: number,
            labels: string[],
            dataSets: { label: string, backgroundColor: string, hoverBackgroundColor: string, data: number[] }[]
        } {

        const labels: string[] = [];
        const dataSets: { label: string, backgroundColor: string, hoverBackgroundColor: string, data: number[] }[] = [];
        let maxValue = 0;

        for (const serie of chartBundle.series) {
            dataSets.push(
                {
                    label: serie.legend,
                    data: [],
                    backgroundColor: serie.key === '0' ? this.previouseYearAccentColor : this.currentYearAccentColor,
                    hoverBackgroundColor: serie.key === '0' ? this.previouseYearAccentColor : this.currentYearAccentColor
                }
            );
        }

        const dataSet = chart.dataSet.find(ds => ds.period === period);


        // get others total
        this.extraInfoValue = '';
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


        for (const dataPoint of dataSet.dataPoints) {

            // the dataPoint with total values or label '@@OTHERS@@' are not used on the chart
            if (dataPoint.isTotal || dataPoint.label === '@@OTHERS@@') {
                continue;
            }

            labels.push(dataPoint.label.substr(0, 5));

            for (let i = 0; i < chartBundle.series.length; i++) {
                const serie = chartBundle.series[i];
                const value = dataPoint.values.find(v => v.seriesKey === serie.key);
                let finalValue = 0;

                if (value) {
                    finalValue = this.getCorrectValue(value, useReportingValue);
                    maxValue = finalValue > maxValue ? finalValue : maxValue;
                }

                dataSets[i].data.push(finalValue);
            }
        }

        return {
            dataSets: dataSets,
            maxValue: maxValue,
            labels: labels
        };
    }

    private getCorrectValue(value: { seriesKey: string, value: number, reportingValue: number }, useReportingValue: boolean): number {
        return useReportingValue ? value.reportingValue : value.value;
    }

    private calcPercentageDeltaBetweenTwoNumbers(valueA: number, valueB: number, roundValue?: boolean) {
        if (!valueA || valueA === 0) {
            return 0;
        }

        let delta = ((valueB - valueA) / Math.abs(valueA)) * 100;
        delta = roundValue ? Math.round(delta) : delta;
        return delta;
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
}
