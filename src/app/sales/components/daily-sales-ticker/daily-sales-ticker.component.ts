import { Component, ViewChild, ElementRef, OnInit, Input } from '@angular/core';

import { Chart } from 'chart.js';
import { CompanySalesSummary, CompanyDailySalesSummary } from '../../entities';

@Component({
    selector: 'sales-ticker',
    templateUrl: './daily-sales-ticker.component.html',
    styleUrls: ['./daily-sales-ticker.component.scss']
})

export class DailySalesTickerComponent implements OnInit {

    private todayPercentualSales: number;
    private lastWeekPercentualSales: number;

    companyDailySalesSummary: CompanyDailySalesSummary;
    salesDelta: number;

    todayLegend: string;
    lastWeekDayLegend: string;

    weekDay: string;

    get dataStyle(): any {
        return {
            width: `${this.elementRef.nativeElement.children[0].clientHeight * .5}px`
        };
    }

    get todayBarStyle(): any {
        return {
            top: `${100 - this.todayPercentualSales}%`
        };
    }

    get lastWeekBarStyle(): any {
        return {
            top: `${100 - this.lastWeekPercentualSales}%`
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
        this.buildChart(this.companyDailySalesSummary);
    }

    private buildChart(companySalesSummary: CompanyDailySalesSummary) {
        // if (companySalesSummary) {
        //     return;
        // }

        // get the today's month day
        const date = new Date();
        this.todayLegend = `${date.getDate()}`;

        // get the day last week month day
        date.setDate(date.getDate() - 7);
        this.lastWeekDayLegend = `${date.getDate()}`;

        this.weekDay = `${date.getDay() + 1}`;

        // calculate the bars values
        // the bigger value will always be represented on a bar of 100%
        const todaySales = companySalesSummary.sales;
        const lastWeekSales = companySalesSummary.salesPrevious;

        this.salesDelta = ((todaySales - lastWeekSales) / (lastWeekSales)) * 100;

        if (todaySales > lastWeekSales) {
            this.lastWeekPercentualSales = (lastWeekSales * 100) / todaySales;
            this.todayPercentualSales = 100;
        } else {
            this.todayPercentualSales = (todaySales * 100) / lastWeekSales;
            this.lastWeekPercentualSales = 100;
        }
    }
}
