import { Component, ViewChild, ElementRef, OnInit, Input } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
    selector: 'hr-salary-chart',
    templateUrl: './salary-chart.component.html',
    styleUrls: ['./salary-chart.component.scss']
})

export class SalaryChartComponent implements OnInit {

    private chart: any;

    @ViewChild('chartCanvas') chartCanvas: ElementRef;
    @Input() labels: string[];
    @Input() lastYearValues: number[];
    @Input() currentYearValues: number[];

    constructor() {

    }

    ngOnInit(): void {
        this.chart = new Chart(this.chartCanvas.nativeElement, {
            type: 'bar',
            data: {
                labels: this.labels,
                datasets: [
                    {
                        data: this.currentYearValues,
                        backgroundColor: 'rgb(255, 118, 80)'
                    },
                    {
                        data: this.lastYearValues,
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
