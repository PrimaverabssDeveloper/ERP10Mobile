import { Chart } from 'chart.js';
import { Component, Input, ViewChild, HostListener, OnInit } from '@angular/core';
import { Company, Serie, ChartData, ChartBundle } from '../../entities';
import { CurrencyPipe } from '@angular/common';


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

    currentYearLegend: string;
    previousYearLegend: string;
    yAxisScaleStep: number;
    yAxisScaleUnitPrefix: string;
    currentCurrency: string;
    currentPeriodType: 'M' | 'W';

    @ViewChild('chartCanvas') chartCanvas;

    @Input() set data(data: {
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
    }) {
        if (data) {
            this.updateChart(
                data.chartBundle,
                data.chart,
                data.period,
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
     *
     */
    constructor(private currencyPipe: CurrencyPipe) {
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

    private updateChart(
        chartBundle: ChartBundle,
        chart: ChartData,
        period: string,
        previousYearSerie: Serie,
        currentYearSerie: Serie,
        currency: string,
        useReportingValue: boolean,
        currentYearAccentColor: string,
        previouseYearAccentColor: string,
        currentYearAccentColorWithTransparency: string,
        previouseYearAccentColorWithTransparency: string
    ) {

        this.currentYearLegend = currentYearSerie ? currentYearSerie.legend : null;
        this.previousYearLegend = previousYearSerie ? previousYearSerie.legend : null;
        this.currentCurrency = currency;
        this.currentPeriodType = chartBundle.periodType;

        if (chartBundle.isTimeChart) {
            const data = this.buildTimeChartData(
                chart,
                previousYearSerie,
                currentYearSerie,
                useReportingValue,
                currentYearAccentColor,
                previouseYearAccentColor,
                currentYearAccentColorWithTransparency,
                previouseYearAccentColorWithTransparency
            );

            this.drawChart(chart.valueType, chartBundle.isTimeChart, currency, data);
        } else {

            const data = this.buildTopChartData(
                chart,
                previousYearSerie,
                currentYearSerie,
                period,
                useReportingValue,
                currentYearAccentColor,
                previouseYearAccentColor
            );

            this.drawChart(chart.valueType, chartBundle.isTimeChart, currency, data);
        }
    }

    private drawChart(
        valueType: 'accum' | 'abs',
        isTimeChart: boolean,
        currency: string,
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

    private buildTimeChartData(
        chart: ChartData,
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

        const labels: string[] = [];
        const dataSets: { label: string, backgroundColor: string, hoverBackgroundColor, data: number[] }[] = [];
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
                hoverBackgroundColor: finalCurrentYearAccentColor
            }
        );

        // previous year serie
        dataSets.push(
            {
                label: previousYearSerie.legend,
                data: [],
                backgroundColor: finalPreviouseYearAccentColor,
                hoverBackgroundColor: finalPreviouseYearAccentColor
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

            // the dataPoint with total values or label '@@OTHERS@@' are not used on the chart
            if (dataPoint.isTotal || dataPoint.label === '@@OTHERS@@') {
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
}
