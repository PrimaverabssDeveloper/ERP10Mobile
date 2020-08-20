import { Component, ViewChild, ElementRef, OnInit, Input } from '@angular/core';

import { Chart } from 'chart.js';
import { CompanySalesSummary, CompanyDailySalesSummary, SalesSettings } from '../../entities';
import { Router } from '@angular/router';
import { SalesSettingsService } from '../../services';
import { Subscription } from 'rxjs';

@Component({
    selector: 'sales-ticker',
    templateUrl: './daily-sales-ticker.component.html',
    styleUrls: ['./daily-sales-ticker.component.scss']
})

export class DailySalesTickerComponent implements OnInit {

    private todayPercentualSales: number;
    private lastWeekPercentualSales: number;

    companyDailySalesSummary: CompanyDailySalesSummary;
    salesSettingsService: SalesSettingsService;
    salesDelta: number;
    salesDeltaAvailable: boolean;
    useReferenceCurrency: boolean = false;
    referenceCurrencySettingChangedSubscription: Subscription;

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

    constructor(private elementRef: ElementRef, private router: Router) {

    }
    
    ngOnDestroy(): void {
        if (this.referenceCurrencySettingChangedSubscription !== null && this.referenceCurrencySettingChangedSubscription !== undefined) {
            this.referenceCurrencySettingChangedSubscription.unsubscribe();
            this.referenceCurrencySettingChangedSubscription = null;
        }
    }

    /**
    * Execute on page initialization.
    *
    * @memberof SalesTickerComponent
    */
    async ngOnInit(){
        this.buildChart(this.companyDailySalesSummary);

        await this.salesSettingsService.getUseReferenceCurrencySettingValueAsync()
            .then(
                value => {
                    this.useReferenceCurrency = value;
                }
            );

        if (this.referenceCurrencySettingChangedSubscription === undefined) {
            this.referenceCurrencySettingChangedSubscription = this.salesSettingsService.useReferenceCurrencySettingChanged
                .subscribe(
                    value => {
                        console.log(value);
                        this.useReferenceCurrency = value.newValue;
                    });
        }
    }

    navigateToSales() {
        this.router.navigate(['sales', 'home', this.companyDailySalesSummary.key]);
    }

    private buildChart(companySalesSummary: CompanyDailySalesSummary) {
        // if (companySalesSummary) {
        //     return;
        // }

        // get the today's month day
        const date = new Date(companySalesSummary.dataTimestamp);
        this.todayLegend = `${date.getDate()}`;

        // get the day last week month day
        date.setDate(date.getDate() - 7);
        this.lastWeekDayLegend = `${date.getDate()}`;

        this.weekDay = `${date.getDay() + 1}`;

        // calculate the bars values
        // the bigger value will always be represented on a bar of 100%
        const todaySales = companySalesSummary.sales;
        const lastWeekSales = companySalesSummary.salesPrevious;

        if (todaySales === 0 || lastWeekSales === 0) {
            this.salesDeltaAvailable = false;
        } else {
            this.salesDeltaAvailable = true;
            this.salesDelta = ((todaySales - lastWeekSales) / (lastWeekSales)) * 100;
        }

        if (todaySales > lastWeekSales) {
            this.lastWeekPercentualSales = (lastWeekSales * 100) / todaySales;
            this.todayPercentualSales = 100;
        } else {
            this.todayPercentualSales = (todaySales * 100) / lastWeekSales;
            this.lastWeekPercentualSales = 100;
        }
    }
}
