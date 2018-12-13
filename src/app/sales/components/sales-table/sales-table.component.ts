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
        deltaPercentageValue: number
    }[] = [];

    currentYearLabel: string;
    previousYearLabel: string;
    currency: string;

    @Input() set data(data: {
        chartBundle: ChartBundle,
        chart: ChartData,
        period: string,
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
        previousYearSerie: Serie,
        currentYearSerie: Serie,
        useReportingValue: boolean,
        currency: string
    ) {

        this.currentYearLabel = currentYearSerie.legend;
        this.previousYearLabel = previousYearSerie.legend;
        this.currency = currency;

        if (chartBundle.isTimeChart) {
            this.rows = this.buildTimeChartData(chart, previousYearSerie, currentYearSerie, useReportingValue);
        } else {
            this.rows = this.buildTopChartData(chart, period, previousYearSerie, currentYearSerie, useReportingValue);
        }
    }

    private buildTimeChartData(
        chart: ChartData,
        previousYearSerie: Serie,
        currentYearSerie: Serie,
        useReportingValue: boolean,
    ): {
        label: string,
        currentYearValue: number,
        previousYearValue: number,
        deltaPercentageValue: number
    }[] {
        const data: {
            label: string,
            currentYearValue: number,
            previousYearValue: number,
            deltaPercentageValue: number
        }[] = [];

        for (const dataSet of chart.dataSet) {
            const dataPoint = dataSet.dataPoints[0];

            if (!dataPoint) {
                data.push({
                    label: 'N/A',
                    currentYearValue: 0,
                    previousYearValue: 0,
                    deltaPercentageValue: 0
                });

                continue;
            }

            if (!dataPoint.values) {
                data.push({
                    label: dataPoint.label ? dataPoint.label : 'N/A',
                    currentYearValue: 0,
                    previousYearValue: 0,
                    deltaPercentageValue: 0
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
                deltaPercentageValue: this.calcPercentageDeltaBetweenTwoNumbers(previousYearFinalValue, currentYearFinalValue)
            });
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
        deltaPercentageValue: number
    }[] {
        const data: {
            label: string,
            currentYearValue: number,
            previousYearValue: number,
            deltaPercentageValue: number
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
                    deltaPercentageValue: 0
                });

                continue;
            }

            if (!dataPoint.values) {
                data.push({
                    label: dataPoint.label ? dataPoint.label : 'N/A',
                    currentYearValue: 0,
                    previousYearValue: 0,
                    deltaPercentageValue: 0
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
                deltaPercentageValue: this.calcPercentageDeltaBetweenTwoNumbers(previousYearFinalValue, currentYearFinalValue)
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
