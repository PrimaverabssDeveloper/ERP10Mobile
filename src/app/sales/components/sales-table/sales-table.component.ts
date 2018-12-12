import { Component, Input } from '@angular/core';
import { Company, Serie, ChartData } from '../../entities';


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

    @Input() set data(data: { chart: ChartData, previousYearSerie: Serie, currentYearSerie: Serie, useReportingValue: boolean }) {
        if (data) {
            this.updateTable(data.chart, data.previousYearSerie, data.currentYearSerie, data.useReportingValue);
        }
    }

    private updateTable(
        chart: ChartData,
        previousYearSerie: Serie,
        currentYearSerie: Serie,
        useReportingValue: boolean
    ) {

        this.currentYearLabel = currentYearSerie.legend;
        this.previousYearLabel = previousYearSerie.legend;

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

        this.rows = data;
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
