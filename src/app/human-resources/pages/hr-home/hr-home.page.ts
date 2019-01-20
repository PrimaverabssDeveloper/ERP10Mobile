import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Slides, LoadingController } from '@ionic/angular';
import { PageBase } from '../../../shared/pages';
import { HumanResourcesServiceProvider, HumanResourcesService } from '../../services';
import { Salaries, YearSalary, MonthSalary, BaseSalary, Value } from '../../models';
import { SalaryChartDataColumn, SalaryChartData, SalaryChartVerticalAxis } from '../../components';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

@Component({
    templateUrl: './hr-home.page.html',
    styleUrls: ['./hr-home.page.scss'],
    providers: [HumanResourcesServiceProvider]
})

export class HrHomePage extends PageBase implements OnInit {

    private localizedMonthsNames: string[] = [];

    @ViewChild('monthlyChartsSlide') monthlyChartsSlide: Slides;

    salaryPeriodState: 'yearly' | 'monthly';
    salaryValuesState: 'money' | 'percentage';
    chartsDrawerState: 'open' | 'close';

    salaries: Salaries;

    salaryDate: string;
    salaryStatus: string;
    salaryPortions: MoneyValue[];
    salaryExtraInformations: SalaryExtraInformations[];

    yearlyChartData: SalaryChartData;

    monthlyChartsData: {
        year: number,
        monthsChartData: SalaryChartData
    }[];

    currentYearSalary: YearSalary;
    currentMonthSalary: MonthSalary;

    constructor(
        public loadingController: LoadingController,
        private humanResourcesService: HumanResourcesService,
        private translate: TranslateService,
        private datePipe: DatePipe
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

        this.localizedMonthsNames = await this.getAllLocalizedMonthsNamesAsync();

        this.salaries = await this.getSalariesAsync();
        if (!this.salaries) {
            alert('TBD: Nao foi possivel obter os salários. tente mais tarde');
        }

        this.buildCharts(this.salaries, this.localizedMonthsNames);

        this.currentYearSalary = this.salaries.data[this.salaries.data.length - 1];
        this.currentMonthSalary = this.currentYearSalary.months[this.currentYearSalary.months.length - 1];

        this.updateView(this.salaries, this.localizedMonthsNames);

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
        this.updateView(this.salaries, this.localizedMonthsNames);
    }

    changeSalaryPeriodToYearlyAction() {
        this.salaryPeriodState = 'yearly';
        this.updateView(this.salaries, this.localizedMonthsNames);
    }

    onSelectedYearSalaryChange(yearSalary: YearSalary) {
        this.currentYearSalary = yearSalary;
        this.updateView(this.salaries, this.localizedMonthsNames);
    }

    onSelectedMonthSalaryChange(monthSalary: MonthSalary) {
        this.currentMonthSalary = monthSalary;
        this.updateView(this.salaries, this.localizedMonthsNames);
    }

    private updateView(salaries: Salaries, localizedMonthsNames: string[]) {

        const currency = salaries.currency;
        let salary: BaseSalary;
        let netValue: Value;
        let grossValue: Value;

        this.salaryPortions = [];

        if (this.salaryPeriodState === 'yearly') {

            salary = this.currentYearSalary;
            netValue = this.currentYearSalary.netTotal;
            grossValue = this.currentYearSalary.grossTotal;
            this.salaryDate = `${this.currentYearSalary.year}`;

            // update the status
            this.translate
                .get('HUMAN_RESOURCES.HR_PAGE.YEAR_STATUS')
                .toPromise()
                .then(res => {
                    this.salaryStatus = res.replace('{year}', `${this.currentYearSalary.year}`);
                });

        } else {
            salary = this.currentMonthSalary;
            netValue = this.currentMonthSalary.netValue;
            grossValue = this.currentMonthSalary.grossValue;
            const localizedMonthName = localizedMonthsNames[this.currentMonthSalary.month - 1]; // months start at 1 but arrais start at 0
            this.salaryDate = `${localizedMonthName} ${this.currentMonthSalary.year}`;

            // the salary payment has been issued
            if (this.currentMonthSalary.paymentMethods && this.currentMonthSalary.paymentMethods.length > 0) {
                this.translate
                    .get('HUMAN_RESOURCES.HR_PAGE.MONTH_STATUS_PAYMENT_ISSUED')
                    .toPromise()
                    .then(res => {
                        this.salaryStatus = res;
                    });
            } else {
                this.translate
                    .get('HUMAN_RESOURCES.HR_PAGE.MONTH_STATUS_SALARY_PROCESSED')
                    .toPromise()
                    .then(res => {
                        this.salaryStatus = res.replace('{date}', this.datePipe.transform(this.currentMonthSalary.paymentEmitDate));
                    });
            }
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

    private buildCharts(salaries: Salaries, localizedMonthsNames: string[]) {

        // build years chart data
        const yearRes = this.buildYearsSalariesChartData(salaries);
        this.yearlyChartData = yearRes.chartData;
        this.currentYearSalary = yearRes.currentYearSalary;

        // build monthly salary chart data
        const monthlyRes = this.buildMonthlySalariesChartData(salaries, localizedMonthsNames);
        this.monthlyChartsData = monthlyRes.chartData;
        this.currentMonthSalary = monthlyRes.currentMonthSalary;
    }

    private buildYearsSalariesChartData(salaries: Salaries): { chartData: SalaryChartData, currentYearSalary: YearSalary } {

        // build year salary chart data
        const columns = salaries.data.map(y => ({
            label: `${y.year}`,
            grossValue: y.grossTotal.value,
            netValue: y.netTotal.value,
            source: y,
            selected: false
        }));

        // make the current year selected
        const currentYearSalary = columns[columns.length - 1];
        currentYearSalary.selected = true;

        return {
            chartData: {
                columns: columns,
                verticalAxisData: this.buildSalaryChartVerticalAxis(salaries.currency, columns)
            },
            currentYearSalary: currentYearSalary.source as YearSalary
        };
    }

    private buildMonthlySalariesChartData(salaries: Salaries, localizedMonthsNames: string[]): {
        chartData: {
            year: number;
            monthsChartData: SalaryChartData;
        }[],
        currentMonthSalary: MonthSalary
    } {

        const monthsExtractor = (months: MonthSalary[], year: number): SalaryChartData => {
            const columns: SalaryChartDataColumn[] = [];

            for (let i = 0; i < 12; i++) {
                const month = months.find(m => m.month === i + 1);
                const localizedMonthName = localizedMonthsNames[i].toLocaleLowerCase().substring(0, 3);

                if (month) {
                    month.year = year;
                    columns.push({
                        label: localizedMonthName,
                        grossValue: month.grossValue.value,
                        netValue: month.netValue.value,
                        source: month
                    });
                } else {
                    columns.push({
                        label: localizedMonthName,
                        grossValue: 0,
                        netValue: 0,
                        source: null
                    });
                }
            }

            return {
                columns: columns,
                verticalAxisData: this.buildSalaryChartVerticalAxis(salaries.currency, columns)
            };
        };

        const monthlyChartsData = salaries.data.map(y => ({
            year: y.year,
            monthsChartData: monthsExtractor(y.months, y.year)
        }));

        // make the last month, with value, of the last year selected
        const currentYear = monthlyChartsData[monthlyChartsData.length - 1];
        const monthsWithValue = currentYear.monthsChartData.columns.filter(m => m.source);
        const currentMonth = monthsWithValue[monthsWithValue.length - 1];
        currentMonth.selected = true;

        return {
            chartData: monthlyChartsData,
            currentMonthSalary: currentMonth.source as MonthSalary
        };
    }


    private buildSalaryChartVerticalAxis(currency: string, columns: SalaryChartDataColumn[]): SalaryChartVerticalAxis {

        // get the max value for the current chart
        const maxValue = columns.map(x => x.grossValue).sort().reverse()[0];

        const yAxisNumberOfSteps = 4;
        const yAxisMaxValues = this.getPossibleMaximumYValues(yAxisNumberOfSteps);
        const yAxisMaxValueStepAndUnit = this.calcYAxisMaxValueStepAndUnit(maxValue, yAxisNumberOfSteps, yAxisMaxValues);
        const yAxisScaleStep = yAxisMaxValueStepAndUnit.yAxisScaleStep;
        const yAxisScaleUnitPrefix = yAxisMaxValueStepAndUnit.yAxisScaleUnitPrefix;
        const yAxisMaxValue = yAxisMaxValueStepAndUnit.yAxisMaxValue;

        return {
            scaleStep: yAxisScaleStep,
            scaleUnitPrefix: yAxisScaleUnitPrefix,
            maxValue: yAxisMaxValue,
            currency: currency
        };
    }

    private getPossibleMaximumYValues(yAxisNumberOfSteps: number): number[] {

        let baseTicks = yAxisNumberOfSteps;
        let baseLcm = this.lcm(yAxisNumberOfSteps, 10);

        while (baseTicks > 10) {
            baseTicks /= 10;
            baseLcm /= 10;
        }

        let limitTicks = baseTicks * 10;

        let limitLcm = 1;
        while (limitLcm < limitTicks) {
            limitLcm *= 10;
        }


        let mode = true;
        let value = baseTicks;
        const values: number[] = [];

        while (value < 10000) {

            if (value < 10 && value + baseTicks < 10) {
                value += baseTicks;
                continue;
            }

            if (mode) {

                value += baseTicks;
                if (value >= limitTicks) {
                    mode = false;
                    baseTicks *= 10;
                    limitTicks *= 10;
                }

            } else {

                value += baseLcm;
                if (value >= limitLcm && (value % baseTicks === 0)) {
                    mode = true;
                    baseLcm *= 10;
                    limitLcm *= 10;
                }

            }

            if (value < 10000) {
                const dividend = value;
                const divisor = 10;
                values.push(dividend / divisor);
            }
        }

        return values;
    }

    private calcYAxisMaxValueStepAndUnit(maximumValue: number, yAxisNumberOfSteps: number, yAxisMaxValues: number[])
        : { yAxisMaxValue: number, yAxisScaleStep: number, yAxisScaleUnitPrefix: string } {

        let divider = 1;
        const thousandDecimal = 1000;

        while (!((maximumValue / divider) < thousandDecimal)) {
            divider *= 1000;
        }

        const baseMaximum = maximumValue / divider;

        let scaleMaximum: number = null;

        for (const possibleMaximum of yAxisMaxValues) {
            if (baseMaximum < possibleMaximum) {
                scaleMaximum = possibleMaximum;
                break;
            }
        }

        if (!scaleMaximum) {
            scaleMaximum = yAxisMaxValues[0];
            divider *= 1000;
        }

        let prefix = 'T';

        switch (divider) {
            case 1: prefix = ''; break;
            case 1000: prefix = 'K'; break;
            case 1000000: prefix = 'M'; break;
            case 1000000000: prefix = 'B'; break;
        }

        const yMaximumValue = scaleMaximum * divider;
        const yScaleStep = scaleMaximum / yAxisNumberOfSteps;

        return {
            yAxisMaxValue: yMaximumValue,
            yAxisScaleStep: yScaleStep,
            yAxisScaleUnitPrefix: prefix
        };
    }

    private lcm(x: number, y: number) {
        const l = Math.min(x, y);
        const h = Math.max(x, y);
        const m = l * h;

        for (let i = h; i < m; i += h) {
            if (i % l === 0) {
                return i;
            }
        }

        return m;
    }

    private async getSalariesAsync(): Promise<Salaries> {
        let salaries: Salaries;

        try {
            salaries = await this.humanResourcesService.getSalaries();
        } catch (error) {
            console.log(error);
        }

        return salaries;
    }

    private async getAllLocalizedMonthsNamesAsync(): Promise<string[]> {

        const localizedMonthsNames: string[] = [];

        for (let i = 1; i <= 12; i++) {
            let monthResource = '';

            try {
                monthResource = await this.translate.get(`SHARED.DATES.MONTHS.${i}`).toPromise();
            } catch (error) {
                console.log(error);
            }

            localizedMonthsNames.push(monthResource);
        }

        return localizedMonthsNames;
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
