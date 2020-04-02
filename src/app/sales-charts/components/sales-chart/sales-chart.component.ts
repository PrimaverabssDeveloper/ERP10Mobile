import { Chart } from 'chart.js';
import { Component, Input, ViewChild, HostListener, Output, EventEmitter, OnInit } from '@angular/core';
import { Serie, ChartData, ChartBundle, ChartPeriodType } from '../../entities';
import { SalesChartUpdateEvent } from './entities';
import { LocaleCurrencyPipe } from '../../../shared/pipes';
import { TranslateService } from '@ngx-translate/core';


@Component({
    selector: 'sales-chart',
    templateUrl: './sales-chart.component.html',
    styleUrls: ['./sales-chart.component.scss']
})

export class SalesChartComponent {

    private readonly yAxisNumberOfSteps = 4;
    private chart: any;
    private touchDownWithoutMovement: boolean;
    private yAxisMaxValues: number[];

    private monthsLocalized: {[key: string]: string};
    private quarterBarLegendPrefix: string;
    private weeksBarLegendPrefix: string;

    currentYearLegend: string;
    previousYearLegend: string;
    yAxisScaleStep: number;
    yAxisScaleUnitPrefix: string;
    currentCurrency: string;
    currentPeriodType: ChartPeriodType;

    @ViewChild('chartCanvas', {static: true}) chartCanvas;

    @Input() set data(data: {
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
    }) {
        if (data) {
            this.updateChart(
                data.chartBundle,
                data.chart,
                data.period,
                data.timeFrame,
                data.previousYearSerie,
                data.currentYearSerie,
                data.currency,
                data.useReportingValue,
                data.currentYearAccentColor,
                data.previouseYearAccentColor,
                data.currentYearAccentColorWithTransparency,
                data.previouseYearAccentColorWithTransparency
            );
        }
    }

    /**
     * Fires an event every time that the chart is updated with new values.
     *
     * @memberof SalesTableComponent
     */
    @Output() chartUpdated = new EventEmitter<SalesChartUpdateEvent>();

    /**
     *
     */
    constructor(private localeCurrencyPipe: LocaleCurrencyPipe, private translateService: TranslateService ) {
        this.yAxisMaxValues = this.getPossibleMaximumYValues(this.yAxisNumberOfSteps);
    }

    // #region 'Public Methods'

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
    // #endregion

    private async updateChart(
        chartBundle: ChartBundle,
        chart: ChartData,
        period: string,
        timeFrame: 'monthly' | 'quarter',
        previousYearSerie: Serie,
        currentYearSerie: Serie,
        currency: string,
        useReportingValue: boolean,
        currentYearAccentColor: string,
        previousYearAccentColor: string,
        currentYearAccentColorWithTransparency: string,
        previouseYearAccentColorWithTransparency: string
    ) {

        await this.updateLocalizedResources();

        this.currentYearLegend = currentYearSerie ? currentYearSerie.legend : null;
        this.previousYearLegend = previousYearSerie ? previousYearSerie.legend : null;
        this.currentCurrency = currency;
        this.currentPeriodType = chartBundle.periodType;

        if (chartBundle.isTimeChart) {
            const data = this.buildTimeChartData(
                chart,
                timeFrame,
                chartBundle.periodType,
                previousYearSerie,
                currentYearSerie,
                useReportingValue,
                currentYearAccentColor,
                previousYearAccentColor,
                currentYearAccentColorWithTransparency,
                previouseYearAccentColorWithTransparency
            );

            this.drawChart(chart.valueType, chartBundle.isTimeChart, currency, currentYearAccentColor, previousYearAccentColor, data);
        } else {
            if (chartBundle.periodType === ChartPeriodType.Daily) {
                this.currentYearLegend = '#selecionado';
                this.previousYearLegend = '#anterior';
                const data = await this.buildDailyChartData(
                    chart,
                    previousYearSerie,
                    currentYearSerie,
                    period,
                    useReportingValue,
                    currentYearAccentColor,
                    previousYearAccentColor
                );

                this.drawChart(chart.valueType, chartBundle.isTimeChart, currency, currentYearAccentColor, previousYearAccentColor, data);
            } else {
                const data = this.buildTopChartData(
                    chart,
                    previousYearSerie,
                    currentYearSerie,
                    period,
                    useReportingValue,
                    currentYearAccentColor,
                    previousYearAccentColor
                );

                this.drawChart(chart.valueType, chartBundle.isTimeChart, currency, currentYearAccentColor, previousYearAccentColor, data);
            }
        }

        this.chartUpdated.emit({
            chartData: {
                currentYearLegend: this.currentYearLegend,
                previousYearLegend: this.previousYearLegend,
                yAxisScaleStep: this.yAxisScaleStep,
                yAxisScaleUnitPrefix: this.yAxisScaleUnitPrefix,
                currentCurrency: this.currentCurrency
            }
        });
    }

    private drawChart(
        valueType: 'accum' | 'abs',
        isTimeChart: boolean,
        currency: string,
        currentYearAccentColor: string,
        previousYearAccentColor: string,
        data: {
            maxValue: number,
            labels: string[],
            dataSets: { label: string, backgroundColor: string, hoverBackgroundColor: string, data: number[] }[]
        }
    ) {

        const chartType = valueType === 'accum' && isTimeChart ? 'line' : 'bar';

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
                        background-color:${currentYearAccentColor};
                        float:left"></div>
                    <div style="float:left">${this.localeCurrencyPipe.transform(currentYearValue, currency)}</div>
                </div>
                <div style="float:left; width:200px">
                    <div style="
                        width:5px;
                        height:5px;
                        margin-top:3px;
                        margin-right:3px;
                        background-color:${previousYearAccentColor};
                        float:left"></div>
                    <div style="float:left">${this.localeCurrencyPipe.transform(previousYearValue, currency)}</div>
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

    private buildTimeChartData(
        chart: ChartData,
        timeFrame: 'monthly' | 'quarter',
        periodType: ChartPeriodType,
        previousYearSerie: Serie,
        currentYearSerie: Serie,
        useReportingValue: boolean,
        currentYearAccentColor: string,
        previouseYearAccentColor: string,
        currentYearAccentColorWithTransparency: string,
        previouseYearAccentColorWithTransparency: string)
        : {
            maxValue: number,
            labels: string[],
            dataSets: { label: string, backgroundColor: string, hoverBackgroundColor: string, data: number[] }[]
        } {

        let labels: string[] = [];
        const dataSets: { label: string, backgroundColor: string, hoverBackgroundColor, data: number[], lineTension: number }[] = [];
        let maxValue = 0;

        let finalCurrentYearAccentColor: string;
        let finalPreviouseYearAccentColor: string;

        if (chart.valueType === 'abs') {
            finalCurrentYearAccentColor = currentYearAccentColor;
            finalPreviouseYearAccentColor = previouseYearAccentColor;
        } else {
            finalCurrentYearAccentColor = currentYearAccentColorWithTransparency;
            finalPreviouseYearAccentColor = previouseYearAccentColorWithTransparency;
        }

        // current year serie
        dataSets.push(
            {
                label: currentYearSerie.legend,
                data: [],
                backgroundColor: finalCurrentYearAccentColor,
                hoverBackgroundColor: finalCurrentYearAccentColor,
                lineTension: 0
            }
        );

        // previous year serie
        dataSets.push(
            {
                label: previousYearSerie.legend,
                data: [],
                backgroundColor: finalPreviouseYearAccentColor,
                hoverBackgroundColor: finalPreviouseYearAccentColor,
                lineTension: 0
            }
        );

        // right display order series
        const series = [currentYearSerie, previousYearSerie];

        // the Monthly and Weakly Chart has always only one datapoint
        for (const dataPoint of chart.dataSet[0].dataPoints) {
            // the dataPoint with total values is not used on the chart
            if (dataPoint.isTotal) {
                continue;
            }

            if (periodType === ChartPeriodType.Week) {
                labels.push(`${this.weeksBarLegendPrefix}${dataPoint.label}`);
            } else {
                labels.push(this.monthsLocalized[dataPoint.label]);
            }

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

        if (timeFrame === 'quarter') {
            maxValue = 0;
            labels = [
                `${this.quarterBarLegendPrefix}1`,
                `${this.quarterBarLegendPrefix}2`,
                `${this.quarterBarLegendPrefix}3`,
                `${this.quarterBarLegendPrefix}4`
            ];

            if (chart.valueType === 'abs') {
                for (const ds of dataSets) {
                    const quarterValues: number[] = [];
                    for (let i = 0; i < 4; i++) {
                        const quarterValue = ds.data.splice(0, 3).reduce((a , b) => a + b );
                        maxValue = quarterValue > maxValue ? quarterValue : maxValue;
                        quarterValues.push(quarterValue);
                    }

                    ds.data = quarterValues;
                }
            } else {
                for (const ds of dataSets) {
                    const quarterValues: number[] = [];
                    for (let i = 1; i <= 4; i++) {
                        const quarterValue = ds.data[i * 3 - 1];
                        maxValue = quarterValue > maxValue ? quarterValue : maxValue;
                        quarterValues.push(quarterValue);
                    }

                    ds.data = quarterValues;
                }
            }
        }

        return {
            dataSets: dataSets,
            maxValue: maxValue,
            labels: labels
        };
    }

    private async buildDailyChartData(
        chart: ChartData,
        previousYearSerie: Serie,
        currentYearSerie: Serie,
        period: string,
        useReportingValue: boolean,
        currentYearAccentColor: string,
        previouseYearAccentColor: string,
    )
        : Promise<{
            maxValue: number,
            labels: string[],
            dataSets: { label: string, backgroundColor: string, hoverBackgroundColor: string, data: number[] }[]
        }> {

        const labels: string[] = [];
        const dataSets: { label: string, backgroundColor: string, hoverBackgroundColor: string, data: number[] }[] = [];
        let maxValue = 0;


        const currentResource = await this.translateService.get('SALES.CHARTS.DAILY_CHART_CURRENT_LEGENT').toPromise();
        const previousResource = await this.translateService.get('SALES.CHARTS.DAILY_CHART_CURRENT_LEGENT').toPromise();

        // current year serie
        dataSets.push(
            {
                label: currentResource,
                data: [],
                backgroundColor: currentYearAccentColor,
                hoverBackgroundColor: currentYearAccentColor
            }
        );

        // previous year serie
        dataSets.push(
            {
                label: previousResource,
                data: [],
                backgroundColor: previouseYearAccentColor,
                hoverBackgroundColor: previouseYearAccentColor
            }
        );

        // right display order series
        const series = [currentYearSerie, previousYearSerie];

        const dataSet = chart.dataSet.find(ds => ds.period === period);

        for (const dataPoint of dataSet.dataPoints) {

            // the dataPoint with total values or label '##OTHERS##' are not used on the chart
            if (dataPoint.isTotal || dataPoint.label === '##OTHERS##') {
                continue;
            }

            const weekDayIndex = (new Date(dataPoint.description)).getDay() + 1;

            const weekDay = await this.translateService.get(`SHARED.DATES.WEEK_DAYS_NUMBER_TO_NAME.${weekDayIndex}`).toPromise();

            labels.push(`${weekDay.substr(0, 3)}.`);

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
        previousYearSerie: Serie,
        currentYearSerie: Serie,
        period: string,
        useReportingValue: boolean,
        currentYearAccentColor: string,
        previouseYearAccentColor: string,
    )
        : {
            maxValue: number,
            labels: string[],
            dataSets: { label: string, backgroundColor: string, hoverBackgroundColor: string, data: number[] }[]
        } {

        const labels: string[] = [];
        const dataSets: { label: string, backgroundColor: string, hoverBackgroundColor: string, data: number[] }[] = [];
        let maxValue = 0;


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

        const dataSet = chart.dataSet.find(ds => ds.period === period);

        for (const dataPoint of dataSet.dataPoints) {

            // the dataPoint with total values or label '##OTHERS##' are not used on the chart
            if (dataPoint.isTotal || dataPoint.label === '##OTHERS##') {
                continue;
            }

            labels.push(dataPoint.label.substr(0, 5));

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

    private async updateLocalizedResources() {
        this.monthsLocalized = {};
        for (let monthIndex = 1; monthIndex <= 12; monthIndex++) {
            const month: string = await this.translateService.get(`SHARED.DATES.MONTHS.${monthIndex}`).toPromise();
            if (month) {
                this.monthsLocalized[`${monthIndex}`] = month.slice(0, 3).toLocaleLowerCase();
            }
        }

        this.quarterBarLegendPrefix = await this.translateService.get('SALES.CHARTS.QUARTER_CHART_BAR_PREFIX').toPromise();
        this.weeksBarLegendPrefix = await this.translateService.get('SALES.CHARTS.WEEKS_CHART_BAR_PREFIX').toPromise();
    }
}
