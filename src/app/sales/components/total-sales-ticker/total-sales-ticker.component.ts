import { Component, ViewChild, ElementRef, OnInit, Input, OnDestroy } from '@angular/core';

import { Chart } from 'chart.js';
import { CompanySalesSummary, SalesSettings } from '../../entities';
import { Router } from '@angular/router';
import { SalesSettingsService } from '../../services';
import { Subscription } from 'rxjs';
import { ngModuleJitUrl } from '@angular/compiler';

@Component({
    selector: 'sales-ticker',
    templateUrl: './total-sales-ticker.component.html',
    styleUrls: ['./total-sales-ticker.component.scss']
})

export class TotalSalesTickerComponent implements OnInit, OnDestroy {

    private chart: any;

    @ViewChild('chart', { static: true }) chartCanvas: ElementRef;

    companySalesSummary: CompanySalesSummary;
    salesDelta: number;
    salesSettingsService: SalesSettingsService;
    useReferenceCurrency: boolean = false;
    referenceCurrencySettingChangedSubscription: Subscription;
    salesDeltaAvailable: boolean;

    get dataStyle(): any {
        return {
            width: `${this.elementRef.nativeElement.children[0].clientHeight * .5}px`
        };
    }

    constructor(
        private elementRef: ElementRef,
        private router: Router) {
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
    async ngOnInit() {
        this.buildChart(this.companySalesSummary);

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
        this.router.navigate(['sales', 'home', this.companySalesSummary.key]);
    }

    private buildChart(companySalesSummary: CompanySalesSummary) {
        if (companySalesSummary && this.chart) {
            return;
        }

        let totalSales = companySalesSummary.totalSales;
        let totalSalesPrevious = companySalesSummary.totalSalesPrevious;

        if (totalSales === 0 || totalSalesPrevious === 0) {
            this.salesDeltaAvailable = false;
        } else {
            this.salesDeltaAvailable = true;
            this.salesDelta = ((totalSales - totalSalesPrevious) / (totalSalesPrevious)) * 100;
        }

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
