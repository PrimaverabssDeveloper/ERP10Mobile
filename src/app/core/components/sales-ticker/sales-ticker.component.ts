import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';

import { Chart } from 'chart.js';

@Component({
    selector: 'sales-ticker',
    templateUrl: './sales-ticker.component.html',
    styleUrls: ['./sales-ticker.component.scss']
})

export class SalesTickerComponent implements OnInit {

    @ViewChild('chart') chartCanvas: ElementRef;

    private chart: any;

    constructor() {

    }

    ngOnInit() {

        this.chart = new Chart(this.chartCanvas.nativeElement, {
            type: 'doughnut',
            data: {
                // labels: ['2017', '2018'],
                datasets: [
                    {
                   //     label: '2018',
                        data: [60, 40],
                        borderColor: 'transparent',
                        hoverBorderColor: 'transparent',
                        hoverBackgroundColor: ['rgb(0, 164, 229)', 'transparent'],
                        backgroundColor: ['rgb(0, 164, 229)', 'transparent']
                    },
                    {
                    //    label: '2017',
                        data: [15, 85],
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
