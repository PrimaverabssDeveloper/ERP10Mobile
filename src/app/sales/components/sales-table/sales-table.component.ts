import { Component, Input } from '@angular/core';
import { Company, Serie, ChartData, ChartBundle } from '../../entities';


@Component({
    selector: 'sales-table',
    templateUrl: './sales-table.component.html',
    styleUrls: ['./sales-table.component.scss']
})

export class SalesTableComponent {

    rows: {
        label: string,
        currentYearValue: number,
        previousYearValue: number,
        deltaPercentageValue: number,
        isTotal: boolean
    }[] = [];

    currentYearLabel: string;
    previousYearLabel: string;
    currency: string;

    @Input() set data(data: {
        chartBundle: ChartBundle,
        chart: ChartData,
        period: string,
        timeFrame: 'monthly' | 'quarter',
        previousYearSerie: Serie,
        currentYearSerie: Serie,
        useReportingValue: boolean,
        currency: string
    }
    ) {
        if (data) {
            this.updateTable(
                data.chartBundle,
                data.chart,
                data.period,
                data.timeFrame,
                data.previousYearSerie,
                data.currentYearSerie,
                data.useReportingValue,
                data.currency);
        }
    }

    private updateTable(
        chartBundle: ChartBundle,
        chart: ChartData,
        period: string,
        timeFrame: 'monthly' | 'quarter',
        previousYearSerie: Serie,
        currentYearSerie: Serie,
        useReportingValue: boolean,
        currency: string
    ) {

        this.currentYearLabel = currentYearSerie.legend;
        this.previousYearLabel = previousYearSerie.legend;
        this.currency = currency;

        if (chartBundle.isTimeChart) {
            this.rows = this.buildTimeChartData(chart, timeFrame, previousYearSerie, currentYearSerie, useReportingValue);
        } else {
            this.rows = this.buildTopChartData(chart, period, previousYearSerie, currentYearSerie, useReportingValue);
        }
    }

    private buildTimeChartData(
        chart: ChartData,
        timeFrame: 'monthly' | 'quarter',
        previousYearSerie: Serie,
        currentYearSerie: Serie,
        useReportingValue: boolean,
    ): {
        label: string,
        currentYearValue: number,
        previousYearValue: number,
        deltaPercentageValue: number,
        isTotal: boolean
    }[] {
        let data: {
            label: string,
            currentYearValue: number,
            previousYearValue: number,
            deltaPercentageValue: number,
            isTotal: boolean
        }[] = [];

        for (const dataSet of chart.dataSet) {
            const dataPoint = dataSet.dataPoints[0];

            if (!dataPoint) {
                data.push({
                    label: 'N/A',
                    currentYearValue: 0,
                    previousYearValue: 0,
                    deltaPercentageValue: 0,
                    isTotal: false
                });

                continue;
            }

            if (!dataPoint.values) {
                data.push({
                    label: dataPoint.label ? dataPoint.label : 'N/A',
                    currentYearValue: 0,
                    previousYearValue: 0,
                    deltaPercentageValue: 0,
                    isTotal: false
                });

                continue;
            }

            const label = dataPoint.label ? dataPoint.label : 'N/A';
            const currentYearValue = dataPoint.values.find(v => v.seriesKey === currentYearSerie.key);
            const previousYearValue = dataSet.dataPoints[0].values.find(v => v.seriesKey === previousYearSerie.key);
            const currentYearFinalValue = this.getCorrectValue(currentYearValue, useReportingValue);
            const previousYearFinalValue = this.getCorrectValue(previousYearValue, useReportingValue);

            data.push({
                label: label,
                currentYearValue: currentYearFinalValue,
                previousYearValue: previousYearFinalValue,
                deltaPercentageValue: this.calcPercentageDeltaBetweenTwoNumbers(previousYearFinalValue, currentYearFinalValue),
                isTotal: dataPoint.isTotal
            });
        }

        if (timeFrame === 'quarter') {

            const quartersData: {
                label: string,
                currentYearValue: number,
                previousYearValue: number,
                deltaPercentageValue: number,
                isTotal: boolean
            }[] = [];

            for (let i = 0; i < 4; i++) {
                const quarterData = data.splice(0, 3);

                let finalQuarterData: {
                    label: string,
                    currentYearValue: number,
                    previousYearValue: number,
                    deltaPercentageValue: number,
                    isTotal: boolean
                };

                if (chart.valueType === 'abs') {
                    finalQuarterData = quarterData.reduce((a, b) => {
                        const currentYearValue = a.currentYearValue + b.currentYearValue;
                        const previousYearValue = a.previousYearValue + b.previousYearValue;

                        return {
                            currentYearValue: currentYearValue,
                            previousYearValue: previousYearValue,
                            deltaPercentageValue: this.calcPercentageDeltaBetweenTwoNumbers(previousYearValue, currentYearValue),
                            label: `Q${i + 1}`,
                            isTotal: false
                        };
                    });
                } else {
                    finalQuarterData = quarterData[quarterData.length - 1];
                    finalQuarterData.label = `Q${i + 1}`;
                }

                quartersData.push(finalQuarterData);
            }

            // the remaining value is the total value
            if (data.length > 0) {
                quartersData.push(data[0]);
            }

            data = quartersData;
        }

        return data;
    }

    private buildTopChartData(
        chart: ChartData,
        period: string,
        previousYearSerie: Serie,
        currentYearSerie: Serie,
        useReportingValue: boolean,
    ): {
        label: string,
        currentYearValue: number,
        previousYearValue: number,
        deltaPercentageValue: number,
        isTotal: boolean
    }[] {
        const data: {
            label: string,
            currentYearValue: number,
            previousYearValue: number,
            deltaPercentageValue: number,
            isTotal: boolean
        }[] = [];

        const dataSet = chart.dataSet.find(ds => ds.period === period);

        if (!dataSet) {
            return [];
        }

        for (const dataPoint of dataSet.dataPoints) {
            if (!dataPoint) {
                data.push({
                    label: 'N/A',
                    currentYearValue: 0,
                    previousYearValue: 0,
                    deltaPercentageValue: 0,
                    isTotal: false
                });

                continue;
            }

            if (!dataPoint.values) {
                data.push({
                    label: dataPoint.label ? dataPoint.label : 'N/A',
                    currentYearValue: 0,
                    previousYearValue: 0,
                    deltaPercentageValue: 0,
                    isTotal: false
                });

                continue;
            }

            // the other data point is not displayed on the table
            if (dataPoint.label === '@@OTHERS@@') {
                continue;
            }

            const label = dataPoint.label ? dataPoint.label : 'N/A';
            const currentYearValue = dataPoint.values.find(v => v.seriesKey === currentYearSerie.key);
            const previousYearValue = dataSet.dataPoints[0].values.find(v => v.seriesKey === previousYearSerie.key);
            const currentYearFinalValue = this.getCorrectValue(currentYearValue, useReportingValue);
            const previousYearFinalValue = this.getCorrectValue(previousYearValue, useReportingValue);

            data.push({
                label: label,
                currentYearValue: currentYearFinalValue,
                previousYearValue: previousYearFinalValue,
                deltaPercentageValue: this.calcPercentageDeltaBetweenTwoNumbers(previousYearFinalValue, currentYearFinalValue),
                isTotal: dataPoint.isTotal
            });
        }

        return data;
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
}
