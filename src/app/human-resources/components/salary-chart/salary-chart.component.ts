import { Component, ViewChild, ElementRef, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Chart } from 'chart.js';
import { MonthSalary, YearSalary } from '../../models';

@Component({
    selector: 'hr-salary-chart',
    templateUrl: './salary-chart.component.html',
    styleUrls: ['./salary-chart.component.scss']
})

export class SalaryChartComponent {
    private readonly yAxisNumberOfSteps = 4;
    private readonly grossValueAccentColor = '#B8B8B8';
    private readonly netValueAccentColor = '#348bdd';
    private readonly grossValueHighlightAccentColor = '#8A8A8A';
    private readonly netValueHighlightAccentColor = '#25629b';

    private chart: any;
    private chartData: SalaryChartData;

    @ViewChild('chartCanvas', {static: true}) chartCanvas: ElementRef;

    @Input() set data(data: SalaryChartData) {
        if (data) {
            this.chartData = data;
            this.buildChart(data);
        }
    }

    @Output() selected = new EventEmitter();

    constructor() {
    }

    private buildChart(data: SalaryChartData) {

        // break the data into the correct arrays to build the datasets
        const labels = data.columns.map(c => c.label);
        const netValues = data.columns.map(c => c.netValue);
        const grossValues = data.columns.map(c => c.grossValue - c.netValue);
        const selectedColumnIndex = data.columns.indexOf(data.columns.find(d => d.selected));

        // create arrays with colors for each value
        const grossValuesBackgrounds: string[] = [];
        for (let i = 0; i < grossValues.length; i++) {
            grossValuesBackgrounds.push(this.grossValueAccentColor);
        }

        const netValuesBackgrounds: string[] = [];
        for (let i = 0; i < netValues.length; i++) {
            netValuesBackgrounds.push(this.netValueAccentColor);
        }

        // highlight the last one
        if (selectedColumnIndex >= 0) {
            grossValuesBackgrounds[selectedColumnIndex] = this.grossValueHighlightAccentColor;
            netValuesBackgrounds[selectedColumnIndex] = this.netValueHighlightAccentColor;
        }

        // create the chart
        this.chart = new Chart(this.chartCanvas.nativeElement, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        data: netValues,
                        backgroundColor: netValuesBackgrounds
                    },
                    {
                        data: grossValues,
                        backgroundColor: grossValuesBackgrounds
                    }
                ],
            },
            options: {
                legend: {
                    display: false,
                },
                tooltips: {
                    enabled: false,
                },
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    xAxes: [{
                        stacked: true,
                        display: true,
                        maxBarThickness: 40,
                        gridLines: {
                            display: false
                        }
                    }],
                    yAxes: [{
                        stacked: true,
                        display: false,
                        gridLines: {
                            display: true
                        },
                        ticks: {
                            beginAtZero: true,
                            maxTicksLimit: 4,
                            max: this.chartData.verticalAxisData.maxValue
                        }
                    }]
                },
                onClick: (ev) => this.onChartClicked(ev)
            }
        });
    }

    onChartClicked(ev: any) {

        const element = this.chart.getElementAtEvent(ev);
        if (!element || element.length === 0) {
            return;
        }

        // get the index of the clicked bar
        const index = element[0]._index;

        // get the colors arrays from the dataset
        const nvBackgrounds = this.chart.data.datasets[0].backgroundColor;
        const gvBackgrounds = this.chart.data.datasets[1].backgroundColor;

        // update the bar color based on the clicked bar index
        for (let i = 0; i < nvBackgrounds.length; i++) {
            nvBackgrounds[i] = i === index ? this.netValueHighlightAccentColor : this.netValueAccentColor;
        }

        for (let i = 0; i < gvBackgrounds.length; i++) {
            gvBackgrounds[i] = i === index ? this.grossValueHighlightAccentColor : this.grossValueAccentColor;
        }

        // update the chart to apply the new color
        this.chart.update();

        // select the correct source and fire the select event
        const selectedSource = this.chartData.columns[index].source;
        this.selected.emit(selectedSource);
    }
}

/**
 * Data to build a salary chart.
 *
 * @export
 * @interface SalaryChartData
 */
export interface SalaryChartData {
    verticalAxisData: SalaryChartVerticalAxis;
    columns: SalaryChartDataColumn[];
}

export interface SalaryChartVerticalAxis {
    scaleStep: number;
    scaleUnitPrefix: string;
    currency: string;
    maxValue: number;
}

/**
 * Defines the dataset for each salary chart column.
 *
 * @export
 * @interface SalaryChartDataColumn
 */
export interface SalaryChartDataColumn {

    /**
     * The column label.
     *
     * @type {string}
     * @memberof SalaryChartDataSet
     */
    label: string;

    /**
     * The column gross value.
     *
     * @type {number}
     * @memberof SalaryChartDataSet
     */
    grossValue: number;

    /**
     * The column net value.
     *
     * @type {number}
     * @memberof SalaryChartDataSet
     */
    netValue: number;

    /**
     * Defines the column values source. The value be from a YearSalary or a MonthSalary.
     *
     * @type {(YearSalary | MonthSalary)}
     * @memberof SalaryChartDataSet
     */
    source: YearSalary | MonthSalary;

    /**
     * Define if the column is selected.
     *
     * @type {boolean}
     * @memberof SalaryChartColumnData
     */
    selected?: boolean;
}
