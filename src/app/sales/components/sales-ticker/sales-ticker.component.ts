import { Component, ViewChild, ElementRef, OnInit, Input } from '@angular/core';

import { Chart } from 'chart.js';
import { CompanySalesSummary } from '../../entities';

@Component({
    selector: 'sales-ticker',
    templateUrl: './sales-ticker.component.html',
    styleUrls: ['./sales-ticker.component.scss']
})

export class SalesTickerComponent implements OnInit {

    private chart: any;

    @ViewChild('chart') chartCanvas: ElementRef;

    public companySalesSummary: CompanySalesSummary;

    constructor() {

    }

    /**
    * Execute on page initialization.
    *
    * @memberof SalesTickerComponent
    */
    ngOnInit(): void {
        this.buildChart(this.companySalesSummary);
    }

    private buildChart(companySalesSummary: CompanySalesSummary) {
        if (companySalesSummary && this.chart) {
            return;
        }

        let totalSales = companySalesSummary.totalSales;
        let totalSalesPrevious = companySalesSummary.totalSalesPrevious;

        if (totalSales > totalSalesPrevious) {
            totalSalesPrevious = (totalSalesPrevious * 60) / totalSales;
            totalSales = 60;
        } else {
            totalSales = (totalSales * 60) / totalSalesPrevious;
            totalSalesPrevious = 60;
        }

        this.chart = new Chart(this.chartCanvas.nativeElement, {
            type: 'doughnut',
            data: {
                // labels: ['2017', '2018'],
                datasets: [
                    {
                   //     label: '2018',
                        data: [totalSales, 100 - totalSales],
                        borderColor: 'transparent',
                        hoverBorderColor: 'transparent',
                        hoverBackgroundColor: ['rgb(0, 164, 229)', 'transparent'],
                        backgroundColor: ['rgb(0, 164, 229)', 'transparent']
                    },
                    {
                    //    label: '2017',
                        data: [totalSalesPrevious, 100 - totalSalesPrevious],
                        borderColor: 'transparent',
                        hoverBorderColor: 'transparent',
                        hoverBackgroundColor: ['rgb(212, 212, 212)', 'transparent'],
                        backgroundColor: ['rgb(212, 212, 212)', 'transparent']
                    }
                ],
            },
            options: {
                rotation: Math.PI * .5,
                responsive: true,
                maintainAspectRatio: false,
                tooltips: {
                    enabled: false
                }
            }
            // options: {
            //     responsive: true,
            //     maintainAspectRatio: false,
            //     scales: {
            //         yAxes: [{
            //             ticks: {
            //                 beginAtZero: true
            //             }
            //         }],
            //         xAxes: [
            //             {
            //                 display: true,
            //                 gridLines: {
            //                     display: false
            //                 }
            //             }
            //         ]
            //     }
            // }
        });
    }
}
