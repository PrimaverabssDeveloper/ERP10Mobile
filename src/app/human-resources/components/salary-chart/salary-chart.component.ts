import { Component, ViewChild, ElementRef, OnInit, Input } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
    selector: 'hr-salary-chart',
    templateUrl: './salary-chart.component.html',
    styleUrls: ['./salary-chart.component.scss']
})

export class SalaryChartComponent {

    private chart: any;

    @ViewChild('chartCanvas') chartCanvas: ElementRef;

    @Input() set data(data: {labels: string[], grossValues: number[], netValues: number[] }) {
        if (data) {
            this.buildChart(data);
        }
    }

    private buildChart(data: {labels: string[], grossValues: number[], netValues: number[] }) {

        // remove the net value to the gross value becouse the chart bars are stacked not over
        const grossValues: number[] = [];
        for (let i = 0; i < data.grossValues.length; i++) {
            grossValues.push(data.grossValues[i] - data.netValues[i]);
        }

        this.chart = new Chart(this.chartCanvas.nativeElement, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        data: data.netValues,
                        backgroundColor: 'rgb(255, 118, 80)'
                    },
                    {
                        data: grossValues,
                        backgroundColor: 'rgb(184, 184, 184)'
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
                        gridLines: {
                            display: false
                        }
                    }],
                    yAxes: [{
                        stacked: true,
                        display: true,
                        gridLines: {
                            display: true
                        }
                    }]
                }
            }
        });
    }
}
