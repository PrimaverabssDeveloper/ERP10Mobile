import { Component, ViewChild, ElementRef, OnInit, Input } from '@angular/core';

import { Chart } from 'chart.js';
import { CompanySalesSummary } from '../../entities';

@Component({
    selector: 'sales-ticker',
    templateUrl: './total-sales-ticker.component.html',
    styleUrls: ['./total-sales-ticker.component.scss']
})

export class TotalSalesTickerComponent implements OnInit {

    private chart: any;

    @ViewChild('chart') chartCanvas: ElementRef;

    companySalesSummary: CompanySalesSummary;
    salesDelta: number;

    get dataStyle(): any {
        return {
            width: `${this.elementRef.nativeElement.children[0].clientHeight * .5}px`
        };
    }

    constructor(private elementRef: ElementRef) {

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
                datasets: [
                    {
                        data: [totalSales, 100 - totalSales],
                        barThickness: '250px',
                        borderColor: 'white',
                        borderWidth: 1,
                        hoverBorderColor: 'white',
                        hoverBackgroundColor: ['#1D317D', 'transparent'],
                        backgroundColor: ['#1D317D', 'transparent']
                    },
                    {
                        data: [totalSalesPrevious, 100 - totalSalesPrevious],
                        barThickness: '250px',
                        borderColor: 'white',
                        borderWidth: 1,
                        hoverBorderColor: 'white',
                        hoverBackgroundColor: ['#DBE0EB', 'transparent'],
                        backgroundColor: ['#DBE0EB', 'transparent']
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
