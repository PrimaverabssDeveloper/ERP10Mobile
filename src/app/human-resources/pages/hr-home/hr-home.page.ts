import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { LoadingController, PopoverController, IonSlides, MenuController, ModalController } from '@ionic/angular';
import { PageBase } from '../../../shared/pages';
import { HumanResourcesServiceProvider, HumanResourcesService } from '../../services';
import { Salaries, YearSalary, MonthSalary, BaseSalary, Value, SalaryDocument } from '../../models';

import {
    SalaryChartDataColumn,
    SalaryChartData,
    SalaryChartVerticalAxis,
    DocumentsListComponent,
    PinComponentBase
} from '../../components';

import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { LocaleService } from '../../../core/services';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { PopoverSelectorComponent } from '../../../shared/components';
import { ModuleCompany } from '../../../core/entities';
import { PinService } from '../../services/pin.service';

@Component({
    templateUrl: './hr-home.page.html',
    styleUrls: ['./hr-home.page.scss'],
    providers: [HumanResourcesServiceProvider]
})

export class HrHomePage extends PageBase implements OnInit {

    private localizedMonthsNames: string[] = [];
    private salaries: Salaries;
    private isCompanySelectorPopoverVisible: boolean;

    @ViewChild('monthlyChartsSlide') monthlyChartsSlide: IonSlides;

    contentVisible: boolean;
    pageTitle: string;

    // all HR companies
    companies: ModuleCompany[];

    // html template variables
    isDocumentsPopoverVisible: boolean;
    salaryDate: string;
    salaryStatus: string;
    salaryPortions: MoneyValue[];
    salaryExtraInformations: SalaryExtraInformations[];

    // view states
    salaryPeriodState: 'yearly' | 'monthly';
    salaryValuesState: 'money' | 'percentage';
    chartsDrawerState: 'open' | 'close';

    // data for charts
    yearlyChartData: SalaryChartData;
    monthlyChartsData: {
        year: number,
        monthsChartData: SalaryChartData
    }[];

    // current salaries selected for year and month
    currentYearSalary: YearSalary;
    currentMonthSalary: MonthSalary;

    constructor(
        public loadingController: LoadingController,
        public popoverController: PopoverController,
        public location: Location,
        public menuController: MenuController,
        private humanResourcesService: HumanResourcesService,
        private translate: TranslateService,
        private datePipe: DatePipe,
        private fileOpener: FileOpener,
        private file: File,
        private emailComposer: EmailComposer,
        private pinService: PinService
    ) {

        super(loadingController, location, menuController);

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
        const accessModuleAllowed = await this.pinService.accessAllowed();

        if (!accessModuleAllowed) {
            this.goBack();
            return;
        }

        await this.showLoading();

        this.localizedMonthsNames = await this.getAllLocalizedMonthsNamesAsync();
        this.companies = this.humanResourcesService.getCompanies();
        if (!this.companies || this.companies.length === 0) {
            await this.hideLoading();
            this.goBack();
            return;
        }

        // get the key from the first company
        const companyKey = this.companies[0].companyKey;

        // show salaries
        await this.showSalariesForCompany(companyKey);

        await this.hideLoading();
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

    hasDocuments(): boolean {
        if (this.salaryPeriodState === 'yearly') {
            return this.currentYearSalary && this.currentYearSalary.documents && this.currentYearSalary.documents.length > 0;
        } else {
            return this.currentMonthSalary && this.currentMonthSalary.documents && this.currentMonthSalary.documents.length > 0;
        }
    }

    async showDocumentsPopoverAction(event: any) {

        let documents: SalaryDocument[];

        // select the right documents for the current view state
        if (this.salaryPeriodState === 'yearly') {
            documents = this.currentYearSalary.documents;
        } else {
            documents = this.currentMonthSalary.documents;
        }

        // create the documents popover
        const popover = await this.popoverController.create({
            component: DocumentsListComponent,
            componentProps: {
                documents: documents
            },
            cssClass: 'popover-width-80-percent-of-screen',
            event: event,
            translucent: true
        });

        // set this variable 'true' to make the documents popover button visualy 'active'
        this.isDocumentsPopoverVisible = true;

        popover.onWillDismiss().then(result => {

            // get the year and month for the current context
            let currentYear: number;
            let currentMonth: number;
            if (this.salaryPeriodState === 'yearly') {
                currentYear = this.currentYearSalary.year;
            } else {
                currentYear = this.currentMonthSalary.year;
                currentMonth = this.currentMonthSalary.month;
            }

            // if is dismissed without any action selected, the result.data will be undefined
            if (result.data) {
                switch (result.data.action) {
                    case 'share':
                        this.shareDocument(result.data.document, currentYear, currentMonth);
                        break;
                    case 'view':
                        this.showDocument(result.data.document, currentYear, currentMonth);
                        break;
                }
            }

            // this will make the documents popover button transition to inactive state
            this.isDocumentsPopoverVisible = false;
        });

        return await popover.present();
    }

    async showCompanySelectorAction(event: any) {

        // dont show popover when there are no more than one company to show
        if (this.companies.length <= 1) {
            return;
        }

        // this will prevent the company to be show more than once at the same time
        if (this.isCompanySelectorPopoverVisible) {
            return;
        }

        this.isCompanySelectorPopoverVisible = true;

        const items = this.companies.map(c => ({label: c.companyKey, data: c}));

        const popover = await this.popoverController.create({
            component: PopoverSelectorComponent,
            componentProps: {
                items: items,
                onItemSelected: (item: {label: string, data: any}) => {
                    this.showSalariesForCompany(item.data.companyKey);
                    popover.dismiss();
                }
            },
            backdropDismiss: true,
            event: event,
            translucent: true,
        });

        popover.onDidDismiss().then(() => {
            this.isCompanySelectorPopoverVisible = false;
        });

        await popover.present();
    }

    // #region 'Protected Methods'

    protected getMenuId(): string {
        return 'human-resources-hr-home-page-menu';
    }

    // #endregion

    private async showSalariesForCompany(companyKey: string) {

        await this.showLoading();

        this.pageTitle = companyKey;

        this.salaries = await this.getSalariesAsync(companyKey);
        if (!this.salaries) {
            await this.hideLoading();
            this.goBack();
        }

        this.buildCharts(this.salaries, this.localizedMonthsNames);

        this.currentYearSalary = this.salaries.data[this.salaries.data.length - 1];
        this.currentMonthSalary = this.currentYearSalary.months[this.currentYearSalary.months.length - 1];

        this.updateView(this.salaries, this.localizedMonthsNames);
        this.contentVisible = true;
        await this.hideLoading();
    }

    private updateView(salaries: Salaries, localizedMonthsNames: string[]) {

        const currency = salaries.currency;
        let salary: BaseSalary;
        let netValue: Value;
        let grossValue: Value;

        this.salaryPortions = [];

        // create salary status
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
                label: 'HUMAN_RESOURCES.HR_PAGE.NET_EARNING_SECTION_TITLE',
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
                label: 'HUMAN_RESOURCES.HR_PAGE.GROSS_EARNING_SECTION_TITLE',
                value: grossValue.value,
                currency: currency,
                percentualValue: grossValue.percentage
            }
        );

        // deductions, p.e., Income Tax, Social Security and Others
        for (const deduction of salary.deductions) {
            this.salaryPortions.push(
                {
                    label: deduction.label,
                    value: deduction.value,
                    currency: currency,
                    percentualValue: deduction.percentage
                }
            );
        }

        // extra information
        this.salaryExtraInformations = [];

        if (salary.paymentMethods && salary.paymentMethods.length > 0) {
            const paymentMethods: SalaryExtraInformations = {
                label: 'HUMAN_RESOURCES.HR_PAGE.PAYMENT_METHOD_SECTION_TITLE',
                infos: salary.paymentMethods.map(pm => (
                    {
                        label: pm.label,
                        value: pm.value,
                        currency: currency,
                        percentualValue: pm.percentage
                    }
                ))
            };

            this.salaryExtraInformations.push(paymentMethods);
        }

        if (salary.salaryBreakdown && salary.salaryBreakdown.length > 0) {
            const compensationBreakdown: SalaryExtraInformations = {
                label: 'HUMAN_RESOURCES.HR_PAGE.COMPENSATION_BREAKDOWN_SECTION_TITLE',
                infos: salary.salaryBreakdown.map(pm => (
                    {
                        label: pm.label,
                        value: pm.value,
                        currency: currency,
                        percentualValue: pm.percentage
                    }
                ))
            };

            this.salaryExtraInformations.push(compensationBreakdown);
        }
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

    private async getSalariesAsync(companyKey: string): Promise<Salaries> {
        let salaries: Salaries;

        try {
            salaries = await this.humanResourcesService.getSalaries(companyKey);
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

    private async showDocument(document: SalaryDocument, year: number, month?: number) {
        // show loading
        await this.showLoading();

        // download pdf blob
        const pdfBlob = await this.humanResourcesService.getPdfFromDocument(document, year, month);

        // store the pdf localy
        const path = await this.storeDocumentPdfAsync(document, pdfBlob);

        // try to open the pdf on the available app
        await this.fileOpener.open(path, 'application/pdf');

        // hide loading
        await this.hideLoading();
    }

    private async shareDocument(document: SalaryDocument, year: number, month?: number) {
        // show loading
        await this.showLoading();

        // download pdf blob
        const pdfBlob = await this.humanResourcesService.getPdfFromDocument(document, year, month);

        // store the pdf localy
        const pdfFilePath = await this.storeDocumentPdfAsync(document, pdfBlob);

        // open the default email app
        try {
            await this.emailComposer.open({attachments: [pdfFilePath]});
        } catch (error) {
            console.log(error);
        }

        // hide loading
        await this.hideLoading();
    }

    private async storeDocumentPdfAsync(document: SalaryDocument, pdfBlob: Blob): Promise<string> {
        const fileName = document.label['en'].replace(/[^a-z0-9]/gi, '_').toLocaleLowerCase().concat('.pdf');

        let filepath = this.file.externalApplicationStorageDirectory;
        if (!filepath) {
            filepath = this.file.documentsDirectory;
        }

        try {
            await this.file.writeFile(filepath, fileName, pdfBlob, { replace: true  });
        } catch (error) {
            console.log(error);
        }

        return filepath.concat(fileName);
    }
}

interface MoneyValue {
    label: string | { [key: string]: string };
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
