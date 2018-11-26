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

    companySalesSummary: CompanySalesSummary;
    salesDelta: number;


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

        this.salesDelta = ((totalSales - totalSalesPrevious) / (totalSalesPrevious)) * 100;

        if (totalSales > totalSalesPrevious) {
            totalSalesPrevious = (totalSalesPrevious * 62.5) / totalSales;
            totalSales = 62.5;
        } else {
            totalSales = (totalSales * 62.5) / totalSalesPrevious;
            totalSalesPrevious = 62.5;
        }

        this.chart = new Chart(this.chartCanvas.nativeElement, {
            type: 'doughnut',
            data: {
                // labels: ['2017', '2018'],
                datasets: [
                    {
                   //     label: '2018',
                        data: [totalSales, 100 - totalSales],
                        barThickness: '200px',
                        borderColor: 'white',
                        borderWidth: 1,
                        hoverBorderColor: 'white',
                        hoverBackgroundColor: ['rgb(0, 164, 229)', 'transparent'],
                        backgroundColor: ['rgb(0, 164, 229)', 'transparent']
                    },
                    {
                    //    label: '2017',
                        data: [totalSalesPrevious, 100 - totalSalesPrevious],
                        barThickness: '200px',
                        borderColor: 'white',
                        borderWidth: 1,
                        hoverBorderColor: 'white',
                        hoverBackgroundColor: ['rgb(212, 212, 212)', 'transparent'],
                        backgroundColor: ['rgb(212, 212, 212)', 'transparent']
                    }
                ],
            },
            options: {
                rotation: Math.PI * .5,
                legend: {
                    display: false,
                },
                responsive: true,
                maintainAspectRatio: false,
                cutoutPercentage: 45,
                tooltips: {
                    enabled: false
                }
            }
        });
    }
}
