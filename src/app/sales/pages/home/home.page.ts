import { Component, ViewChild, OnInit } from '@angular/core';

import { Chart } from 'chart.js';
import { PopoverController } from '@ionic/angular';
import { CompanySelectorComponent } from '../../components';

@Component({
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

    private chart: any;

    @ViewChild('chartCanvas') chartCanvas;

    timeFrame: 'monthly' | 'quarter';
    valueType: 'absolute' | 'accumulated';
    viewType: 'chart' | 'table';

    public dataDate: Date;

    constructor(public popoverController: PopoverController) {
        this.dataDate = new Date();
        this.timeFrame = 'monthly';
        this.valueType = 'absolute';
        this.viewType = 'chart';
    }

    ngOnInit(): void {
        this.updateChart();
    }

    async companySelectorAction(event: any) {
        const popover = await this.popoverController.create({
            component: CompanySelectorComponent,
            event: event,
            translucent: true
          });

          return await popover.present();
    }

    changeTimeFrameAction(timeFrame: 'monthly' | 'quarter') {
        this.timeFrame = timeFrame;
        this.updateChart();
    }

    changeValueType(valueType: 'absolute' | 'accumulated') {
        this.valueType = valueType;
        this.updateChart();
    }

    toggleTableView() {
        this.viewType = this.viewType === 'table' ? 'chart' : 'table';
        this.updateChart();
    }

    private updateChart() {

        let chartType: string;

        const lastYearValues = [10, 12, 3, 5, 2, 3, 5, 12, 5, 8, 9, 12];
        const currentYearValues = [5, 6, 6, 12, 5, 1, 11, 3, 2, 6, 4, 2];

        let labels: string[];

        let lastYearDatasetValues: number[] = [];
        let currentYearDatasetValues: number[] = [];

        switch (this.valueType) {
            case 'absolute': {
                chartType = 'bar';
                currentYearDatasetValues = currentYearValues;
                lastYearDatasetValues = lastYearValues;
            }
            break;
            case 'accumulated': {
                chartType = 'line';

                currentYearDatasetValues = this.accumulateValues(currentYearValues);
                lastYearDatasetValues = this.accumulateValues(lastYearValues);
            }
            break;
        }

        switch (this.timeFrame) {
            case 'monthly': {
                labels = ['jan', 'feb', 'mar', 'apr', 'may', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
            }
            break;
            case 'quarter': {
                labels = ['Q1', 'Q2', 'Q3', 'Q4'];
                currentYearDatasetValues = this.aggregateValues(currentYearDatasetValues, 3);
                lastYearDatasetValues = this.aggregateValues(lastYearDatasetValues, 3);
            }
            break;
        }

        if (this.chart && chartType !== this.chart.config.type) {
            this.chart.destroy();
            this.chart = null;
        }

        if (this.chart) {
            this.chart.type = chartType;
            this.chart.data.labels = labels;
            this.chart.data.datasets[0].data = currentYearDatasetValues;
            this.chart.data.datasets[1].data = lastYearDatasetValues;
            this.chart.update();
        } else {
            this.chart = new Chart(this.chartCanvas.nativeElement, {
                type: chartType,
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: '2018',
                            data: currentYearDatasetValues,
                            backgroundColor: 'rgba(81, 131, 255, .85)'
                        },
                        {
                            label: '2017',
                            data: lastYearDatasetValues,
                            backgroundColor: 'rgba(204, 204, 204, .85)'
                        }
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
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
}
