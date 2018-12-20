import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Slides, LoadingController } from '@ionic/angular';
import { PageBase } from '../../../shared/pages';
import { HumanResourcesServiceProvider, HumanResourcesService } from '../../services';
import { Salaries, YearSalary, MonthSalary } from '../../models';

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

    yearlyChartData: { label: string, grossValue: number, netValue: number, source: YearSalary | MonthSalary }[];
    monthlyChartsData: ChartData[];

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

        this.currentYearSalary = this.salaries.data[0];
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
    }

    changeSalaryPeriodToYearlyAction() {
        this.salaryPeriodState = 'yearly';
    }

    onSelectedYearSalaryChange(yearSalary: YearSalary) {
        this.currentYearSalary = yearSalary;
        this.updateView();
    }

    private updateView() {

        const currency = this.salaries.currency;
        const yearSalary = this.currentYearSalary;

        this.salaryDate = `${yearSalary.year}`;

        this.salaryPortions = [];

        // net earnings
        this.salaryPortions.push(
            {
                label: '#Net Earnings',
                value: yearSalary.netTotal.value,
                currency: currency,
                percentualValue: yearSalary.netTotal.percentage
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
                value: yearSalary.grossTotal.value,
                currency: currency,
                percentualValue: yearSalary.grossTotal.percentage
            }
        );

        // deductions, p.e., Income Tax, Social Security and Others
        for (const deduction of yearSalary.deductions) {
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
            infos: yearSalary.paymentMethods.map(pm => (
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
            infos: yearSalary.salaryBreakdown.map(pm => (
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
