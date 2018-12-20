import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Slides, LoadingController } from '@ionic/angular';
import { PageBase } from '../../../shared/pages';
import { HumanResourcesServiceProvider, HumanResourcesService } from '../../services';
import { Salaries, YearSalary, MonthSalary, BaseSalary, Value } from '../../models';

@Component({
    templateUrl: './hr-home.page.html',
    styleUrls: ['./hr-home.page.scss'],
    providers: [HumanResourcesServiceProvider]
})

export class HrHomePage extends PageBase implements OnInit {

    @ViewChild('monthlyChartsSlide') monthlyChartsSlide: Slides;

    salaryPeriodState: 'yearly' | 'monthly';
    salaryValuesState: 'money' | 'percentage';
    chartsDrawerState: 'open' | 'close';

    salaries: Salaries;

    salaryDate: string;
    salaryPortions: MoneyValue[];
    salaryExtraInformations: SalaryExtraInformations[];

    yearlyChartData: {
        label: string,
        grossValue: number,
        netValue: number,
        source: YearSalary | MonthSalary
    }[];

    monthlyChartsData: {
        year: number,
        months: {
            label: string,
            grossValue: number,
            netValue: number,
            source: YearSalary | MonthSalary
        }[]
    }[];

    currentYearSalary: YearSalary;
    currentMonthSalary: MonthSalary;

    constructor(
        public loadingController: LoadingController,
        private humanResourcesService: HumanResourcesService
    ) {

        super(loadingController);

        this.chartsDrawerState = 'open';
        this.salaryValuesState = 'money';
        this.salaryPeriodState = 'monthly';
    }

    /**
    * Execute on page initialization.
    *
    * @memberof HrHomePage
    */
    async ngOnInit() {
        await this.showLoading();

        try {
            this.salaries = await this.humanResourcesService.getSalaries();
        } catch (error) {
            alert(error);
        }

        this.buildCharts(this.salaries.data);

        this.currentYearSalary = this.salaries.data[this.salaries.data.length - 1];
        this.currentMonthSalary = this.currentYearSalary.months[this.currentYearSalary.months.length - 1];

        this.updateView();
        this.hideLoading();
    }

    toggleSalaryValuesStateAction() {
        this.salaryValuesState = this.salaryValuesState === 'money' ? 'percentage' : 'money';
    }

    toogleChartsDrawerAction() {
        this.chartsDrawerState = this.chartsDrawerState === 'open' ? 'close' : 'open';
    }

    changeSalaryPeriodToMonthlyAction() {
        this.salaryPeriodState = 'monthly';
        this.updateView();
    }

    changeSalaryPeriodToYearlyAction() {
        this.salaryPeriodState = 'yearly';
        this.updateView();
    }

    onSelectedYearSalaryChange(yearSalary: YearSalary) {
        this.currentYearSalary = yearSalary;
        this.updateView();
    }

    onSelectedMonthSalaryChange(monthSalary: MonthSalary) {
        this.currentMonthSalary = monthSalary;
        this.updateView();
    }

    private updateView() {

        const currency = this.salaries.currency;
        let salary: BaseSalary;
        let netValue: Value;
        let grossValue: Value;

        this.salaryPortions = [];

        if (this.salaryPeriodState === 'yearly') {

            salary = this.currentYearSalary;
            netValue = this.currentYearSalary.netTotal;
            grossValue = this.currentYearSalary.grossTotal;
            this.salaryDate = `${this.currentYearSalary.year}`;
        } else {

            salary = this.currentMonthSalary;
            netValue = this.currentMonthSalary.netValue;
            grossValue = this.currentMonthSalary.grossValue;
            this.salaryDate = `${this.currentMonthSalary.month} - ${this.currentMonthSalary.year}`;
        }

        // net earnings
        this.salaryPortions.push(
            {
                label: '#Net Earnings',
                value: netValue.value,
                currency: currency,
                percentualValue: netValue.percentage
            }
        );

        // empty to take the space on the right side of 'net earnings' slot
        this.salaryPortions.push(
            {
                label: null,
                value: null,
                currency: null,
                percentualValue: null
            }
        );

        // gross earnings
        this.salaryPortions.push(
            {
                label: '#Gross Earnings',
                value: grossValue.value,
                currency: currency,
                percentualValue: grossValue.percentage
            }
        );

        // deductions, p.e., Income Tax, Social Security and Others
        for (const deduction of salary.deductions) {
            this.salaryPortions.push(
                {
                    label: deduction.label['pt'],
                    value: deduction.value,
                    currency: currency,
                    percentualValue: deduction.percentage
                }
            );
        }

        const paymentMethods: SalaryExtraInformations = {
            label: '#Payment Method',
            infos: salary.paymentMethods.map(pm => (
                {
                    label: pm.label['pt'],
                    value: pm.value,
                    currency: currency,
                    percentualValue: pm.percentage
                }
            ))
        };

        const compensationBreakdown: SalaryExtraInformations = {
            label: '#Compensation Breakdown',
            infos: salary.salaryBreakdown.map(pm => (
                {
                    label: pm.label['pt'],
                    value: pm.value,
                    currency: currency,
                    percentualValue: pm.percentage
                }
            ))
        };

        this.salaryExtraInformations = [paymentMethods, compensationBreakdown];
    }

    private buildCharts(years: YearSalary[]) {

        // build year salary chart data
        this.yearlyChartData = years.map(y => ({
            label: `${y.year}`,
            grossValue: y.grossTotal.value,
            netValue: y.netTotal.value,
            source: y
        }));

        // build monthly salary chart data
        const monthsExtractor = (months: MonthSalary[]) => {
            const monthdsData = [];

            for (let i = 0; i < 12; i++) {
                const month = months.find(m => m.month === i + 1);
                if (month) {
                    monthdsData.push({
                        label: `${month.month}`,
                        grossValue: month.grossValue.value,
                        netValue: month.netValue.value,
                        source: month
                    });
                } else {
                    monthdsData.push({
                        label: `${i + 1}`,
                        grossValue: 0,
                        netValue: 0,
                        source: null
                    });
                }
            }

            return monthdsData;
        };

        this.monthlyChartsData = years.map(y => ({
            year: y.year,
            months: monthsExtractor(y.months)
        }));
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
