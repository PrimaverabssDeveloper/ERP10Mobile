import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Slides } from '@ionic/angular';

@Component({
    templateUrl: './hr-home.page.html',
    styleUrls: ['./hr-home.page.scss']
})

export class HrHomePage implements OnInit {

    @ViewChild('monthlyChartsSlide') monthlyChartsSlide: Slides;

    salaryPeriodState: 'yearly' | 'monthly';
    salaryValuesState: 'money' | 'percentage';
    chartsDrawerState: 'open' | 'close';

    salaryDate: string;
    salaryPortions: MoneyValue[];
    salaryExtraInformations: SalaryExtraInformations[];

    yearlyChartData: ChartData;
    monthlyChartsData: ChartData[];

    constructor() {
        this.chartsDrawerState = 'open';
        this.salaryValuesState = 'money';
        this.salaryPeriodState = 'monthly';

        this.yearlyChartData = {
            labels: ['2015', '2016', '2017', '2018'],
            lastYearValues: [15000, 16000, 17000, 18000],
            currentYearValues: [16000, 17000, 18000, 19000]
        };

        this.monthlyChartsData = [
            {
                labels: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
                lastYearValues: [
                    1107.71, 1107.71, 1107.71, 1107.71, 1107.71, 1107.71,
                    1107.71, 1607.71, 1107.71, 1207.71, 1207.71, 1207.71],
                currentYearValues: [
                    1207.71, 1207.71, 1207.71, 1207.71, 1207.71, 1207.71,
                    1207.71, 1807.71, 1207.71, 1207.71, 1207.71, 1207.71]
            },
            {
                labels: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
                lastYearValues: [
                    1107.71, 1107.71, 1107.71, 1107.71, 1107.71, 1107.71,
                    1107.71, 1607.71, 1107.71, 1207.71, 1207.71, 1207.71],
                currentYearValues: [
                    1207.71, 1207.71, 1207.71, 1207.71, 1207.71, 1207.71,
                    1207.71, 1807.71, 1207.71, 1207.71, 1207.71, 1207.71]
            },
            {
                labels: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
                lastYearValues: [
                    1107.71, 1107.71, 1107.71, 1107.71, 1107.71, 1107.71,
                    1107.71, 1607.71, 1107.71, 1207.71, 1207.71, 1207.71],
                currentYearValues: [
                    1207.71, 1207.71, 1207.71, 1207.71, 1207.71, 1207.71,
                    1207.71, 1807.71, 1207.71, 1207.71, 1207.71, 1207.71]
            },
            {
                labels: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
                lastYearValues: [
                    1107.71, 1107.71, 1107.71, 1107.71, 1107.71, 1107.71,
                    1107.71, 1607.71, 1107.71, 1207.71, 1207.71, 1207.71],
                currentYearValues: [
                    1207.71, 1207.71, 1207.71, 1207.71, 1207.71, 1207.71,
                    1207.71, 1807.71, 1207.71, 1207.71, 1207.71, 1207.71]
            },
            {
                labels: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
                lastYearValues: [
                    1107.71, 1107.71, 1107.71, 1107.71, 1107.71, 1107.71,
                    1107.71, 1607.71, 1107.71, 1207.71, 1207.71, 1207.71],
                currentYearValues: [
                    1207.71, 1207.71, 1207.71, 1207.71, 1207.71, 1207.71,
                    1207.71, 1807.71, 1207.71, 1207.71, 1207.71, 1207.71]
            },
        ];

        this.salaryDate = 'August 2018';
        this.salaryPortions = [
            {
                label: 'Net Earnings',
                value: 1655.82,
                currency: 'EUR',
                percentualValue: 73.64
            },
            {
                label: '',
                value: null,
                currency: '',
                percentualValue: null
            },
            {
                label: 'Gross Earnings',
                value: 2249.38,
                currency: 'EUR',
                percentualValue: 100
            },
            {
                label: 'Social Security',
                value: 247.43,
                currency: 'EUR',
                percentualValue: 10.99
            },
            {
                label: 'Income Tax',
                value: 303.67,
                currency: 'EUR',
                percentualValue: 13.49
            },
            {
                label: 'Others',
                value: 42.46,
                currency: 'EUR',
                percentualValue: 1.88
            }

        ];

        this.salaryExtraInformations = [
            {
                label: 'Payment Method',
                infos: [
                    {
                        label: 'Meal Card',
                        value: 0,
                        currency: 'EUR',
                        percentualValue: 0
                    },
                    {
                        label: 'Transfer',
                        value: 1655.82,
                        currency: 'EUR',
                        percentualValue: 100
                    }
                ]
            },
            {
                label: 'Compensation Breakdown',
                infos: [
                    {
                        label: 'Salary',
                        value: 1019.16,
                        currency: 'EUR',
                        percentualValue: 61.56
                    },
                    {
                        label: 'Christmas',
                        value: 42.39,
                        currency: 'EUR',
                        percentualValue: 2.55
                    },
                    {
                        label: 'Vacations',
                        value: 594.27,
                        currency: 'EUR',
                        percentualValue: 594.27
                    }
                ]
            }
        ];
    }

    ngOnInit() {
        this.monthlyChartsSlide
            .ionSlideDrag
            .subscribe(v => {
                console.log(v);
            });
    }

    toggleSalaryValuesStateAction() {
        this.salaryValuesState = this.salaryValuesState === 'money' ? 'percentage' : 'money';
    }

    toogleChartsDrawerAction() {
        this.chartsDrawerState = this.chartsDrawerState === 'open' ? 'close' : 'open';
    }

    changeSalaryPeriodToMonthlyAction() {
        this.salaryPeriodState = 'monthly';
    }

    changeSalaryPeriodToYearlyAction() {
        this.salaryPeriodState = 'yearly';
    }
}

interface MoneyValue {
    label: string;
    value: number;
    percentualValue: number;
    currency: string;
}

interface SalaryExtraInformations {
    label: string;
    infos: MoneyValue[];
}

interface ChartData {
    labels: string[];
    currentYearValues: number[];
    lastYearValues: number[];
}
