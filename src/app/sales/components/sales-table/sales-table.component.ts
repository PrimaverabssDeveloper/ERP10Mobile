import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Company, Serie, ChartData, ChartBundle, ChartPeriodType } from '../../entities';
import { MathTools } from '../../../shared/tools';
import { SalesTableRowData } from './entities/sales-table-row-data';
import { SalesTableUpdatedEvent } from './entities';
import { TranslateService } from '@ngx-translate/core';


@Component({
    selector: 'sales-table',
    templateUrl: './sales-table.component.html',
    styleUrls: ['./sales-table.component.scss']
})

export class SalesTableComponent {

    rows: SalesTableRowData[] = [];

    currentYearLabel: string;
    previousYearLabel: string;
    currency: string;

    private monthsLocalized: {[key: string]: string};
    private quarterBarLegendPrefix: string;
    private weeksBarLegendPrefix: string;

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

    /**
     * Fires an event every time that  the table is updated with new values.
     *
     * @memberof SalesTableComponent
     */
    @Output() tableUpdated = new EventEmitter<SalesTableUpdatedEvent>();

    constructor(private translateService: TranslateService ) {
    }

    private async updateTable(
        chartBundle: ChartBundle,
        chart: ChartData,
        period: string,
        timeFrame: 'monthly' | 'quarter',
        previousYearSerie: Serie,
        currentYearSerie: Serie,
        useReportingValue: boolean,
        currency: string
    ) {
        await this.updateLocalizedResources();

        this.currentYearLabel = currentYearSerie.legend;
        this.previousYearLabel = previousYearSerie.legend;
        this.currency = currency;

        if (chartBundle.isTimeChart) {
            this.rows = this.buildTimeChartData(
                                chart,
                                timeFrame,
                                chartBundle.periodType,
                                previousYearSerie,
                                currentYearSerie,
                                useReportingValue);
        } else {
            this.rows = this.buildTopChartData(chart, period, previousYearSerie, currentYearSerie, useReportingValue);
        }

        this.tableUpdated.emit({
            tableData: {
                currency: currency,
                previouseYearLabel: previousYearSerie.legend,
                currentYearLabel: currentYearSerie.legend,
                rows: this.rows
            }
        });
    }

    private buildTimeChartData(
        chart: ChartData,
        timeFrame: 'monthly' | 'quarter',
        periodType: ChartPeriodType,
        previousYearSerie: Serie,
        currentYearSerie: Serie,
        useReportingValue: boolean,
    ): SalesTableRowData[] {

        let data: SalesTableRowData[] = [];

        // timeChart only have one dataset
        const dataSet = chart.dataSet[0];
        for (const dataPoint of dataSet.dataPoints) {

            if (!dataPoint) {
                data.push({
                    label: 'N/A',
                    description: 'N/A',
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
                    description: dataPoint.description ? dataPoint.description : 'N/A',
                    currentYearValue: 0,
                    previousYearValue: 0,
                    deltaPercentageValue: 0,
                    isTotal: false
                });

                continue;
            }

            let label: string;
            if (dataPoint.label) {
                if (periodType === ChartPeriodType.Week) {
                    label = `${this.weeksBarLegendPrefix}${dataPoint.label}`;
                } else {
                    label = this.monthsLocalized[dataPoint.label];
                }
            } else {
                label = 'N/A';
            }

            const description = dataPoint.description ? dataPoint.description : 'N/A';
            const currentYearValue = dataPoint.values.find(v => v.seriesKey === currentYearSerie.key);
            const previousYearValue = dataPoint.values.find(v => v.seriesKey === previousYearSerie.key);
            const currentYearFinalValue = this.getCorrectValue(currentYearValue, useReportingValue);
            const previousYearFinalValue = this.getCorrectValue(previousYearValue, useReportingValue);

            data.push({
                label: label,
                description: description,
                currentYearValue: currentYearFinalValue,
                previousYearValue: previousYearFinalValue,
                deltaPercentageValue: MathTools.variationBetweenTwoNumbers(previousYearFinalValue, currentYearFinalValue),
                isTotal: dataPoint.isTotal
            });
        }

        if (timeFrame === 'quarter') {

            const quartersData: SalesTableRowData[] = [];

            for (let i = 0; i < 4; i++) {
                const quarterData = data.splice(0, 3);

                let finalQuarterData: SalesTableRowData;

                if (chart.valueType === 'abs') {
                    finalQuarterData = quarterData.reduce((a, b) => {
                        const currentYearValue = a.currentYearValue + b.currentYearValue;
                        const previousYearValue = a.previousYearValue + b.previousYearValue;

                        return {
                            currentYearValue: currentYearValue,
                            previousYearValue: previousYearValue,
                            deltaPercentageValue: MathTools.variationBetweenTwoNumbers(previousYearValue, currentYearValue),
                            label: `${this.quarterBarLegendPrefix}${i + 1}`,
                            description: `${this.quarterBarLegendPrefix}${i + 1}`,
                            isTotal: false
                        };
                    });
                } else {
                    finalQuarterData = quarterData[quarterData.length - 1];
                    finalQuarterData.label = `${this.quarterBarLegendPrefix}${i + 1}`;
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
    ): SalesTableRowData[] {
        const data: SalesTableRowData[] = [];

        const dataSet = chart.dataSet.find(ds => ds.period === period);

        if (!dataSet) {
            return [];
        }

        for (const dataPoint of dataSet.dataPoints) {
            if (!dataPoint) {
                data.push({
                    label: 'N/A',
                    description: 'N/A',
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
                    description: dataPoint.description ? dataPoint.description : 'N/A',
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
            const description = dataPoint.description ? dataPoint.description : 'N/A';
            const currentYearValue = dataPoint.values.find(v => v.seriesKey === currentYearSerie.key);
            const previousYearValue = dataSet.dataPoints[0].values.find(v => v.seriesKey === previousYearSerie.key);
            const currentYearFinalValue = this.getCorrectValue(currentYearValue, useReportingValue);
            const previousYearFinalValue = this.getCorrectValue(previousYearValue, useReportingValue);

            data.push({
                label: label,
                description: description,
                currentYearValue: currentYearFinalValue,
                previousYearValue: previousYearFinalValue,
                deltaPercentageValue: MathTools.variationBetweenTwoNumbers(previousYearFinalValue, currentYearFinalValue),
                isTotal: dataPoint.isTotal
            });
        }

        return data;
    }

    private getCorrectValue(value: { seriesKey: string, value: number, reportingValue: number }, useReportingValue: boolean): number {
        return useReportingValue ? value.reportingValue : value.value;
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
