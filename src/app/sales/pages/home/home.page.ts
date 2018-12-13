import { Component, ViewChild, OnInit } from '@angular/core';

import { PopoverController, LoadingController } from '@ionic/angular';
import { CompanySelectorComponent, FooterTabMenu, FooterMenuItemSelectedEvent } from '../../components';
import { PageBase } from '../../../shared/pages';
import { SalesService, SalesServiceProvider } from '../../services';
import { Company, SalesCharts, CompanySales, ChartBundle, ChartData, Serie } from '../../entities';
import { LocaleService } from '../../../core/services';
import { CurrencyPipe } from '@angular/common';

@Component({
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    providers: [SalesServiceProvider]
})
export class HomePage extends PageBase implements OnInit {

    private readonly currentYearAccentColor = 'rgb(29, 49, 125)';
    private readonly previouseYearAccentColor = 'rgb(219, 224, 235)';
    private readonly currentYearAccentColorWithTransparency = 'rgba(29, 49, 125, .5)'; // it has to be in RGBA not HEX
    private readonly previouseYearAccentColorWithTransparency = 'rgba(219, 224, 235, .5)'; // it has to be in RGBA not HEX
    private readonly currentYearSeriesKey = '1';
    private readonly previousYearSeriesKey = '0';

    private companies: Company[];
    private salesCharts: SalesCharts;

    tableData: {
        chart: ChartData,
        previousYearSerie: Serie,
        currentYearSerie: Serie,
        useReportingValue: boolean,
        currency: string
    };

    chartData: {
        chartBundle: ChartBundle,
        chart: ChartData,
        period: string,
        currency: string,
        previousYearSerie: Serie,
        currentYearSerie: Serie,
        useReportingValue: boolean,
        currentYearAccentColor: string,
        previouseYearAccentColor: string,
        currentYearAccentColorWithTransparency: string,
        previouseYearAccentColorWithTransparency: string
    };

    selectedCompanySales: CompanySales;
    selectedChartBundleKey: string;
    selectedChartBundlePeriodType: 'M' | 'W';
    selectedChartBundleLocalizedTitles: { [key: string]: string };
    selectedChartBundleIsTimeChart: boolean;
    extraInfoValue: string;

    selectedPeriod: string;

    showTimeFrameSelector: boolean;

    @ViewChild('chartCanvas') chartCanvas;

    timeFrame: 'monthly' | 'quarter';
    valueType: 'abs' | 'accum';
    viewType: 'chart' | 'table';

    footerTabMenus: FooterTabMenu[];

    public dataDate: Date;

    constructor(
        public popoverController: PopoverController,
        public loadingController: LoadingController,
        private salesService: SalesService,
        private localeService: LocaleService,
        private currencyPipe: CurrencyPipe
    ) {

        super(loadingController);

        this.dataDate = new Date();
        this.timeFrame = 'monthly';
        this.valueType = 'abs';
        this.viewType = 'chart';
        this.showTimeFrameSelector = true;
        this.selectedPeriod = '1';
    }

    async ngOnInit() {

        await this.showLoading();

        // get sales charts
        this.salesCharts = await this.salesService.getSalesCharts();

        // extract info from all companies
        this.companies = this.salesCharts.data.map(cs => ({ key: cs.key, name: cs.name }));

        // by default, select the first company
        this.selectedCompanySales = this.salesCharts.data[0];

        // by default, select the first chart bundle key
        this.selectedChartBundleKey = this.selectedCompanySales.chartBundle[0].key;

        // update view
        this.updateView();

        this.hideLoading();
    }

    async companySelectorAction(event: any) {
        const popover = await this.popoverController.create({
            component: CompanySelectorComponent,
            componentProps: {
                companies: this.companies
            },
            event: event,
            translucent: true
        });

        return await popover.present();
    }

    changeTimeFrameAction(timeFrame: 'monthly' | 'quarter') {
        this.timeFrame = timeFrame;
        this.updateView();
    }

    changeValueType(valueType: 'abs' | 'accum') {
        this.valueType = valueType;
        this.updateView();
    }

    toggleTableView() {
        this.viewType = this.viewType === 'table' ? 'chart' : 'table';
        this.updateView();
    }

    onFooterMenuItemSelected(event: FooterMenuItemSelectedEvent) {
        // select the option
        if (event.menu.key === 'share') {
            // for (const menuItem of event.menu.items) {
            //     menuItem.selected = menuItem === event.menuItem;
            // }
        } else {
            this.selectedChartBundleKey = event.menuItem.key;
            this.updateView();
        }
    }

    onPeriodChanged(period: string) {
        this.selectedPeriod = period;
        this.updateView();
    }

    private updateView() {

        this.updateFooterMenu(this.selectedCompanySales);

        const chartBundle = this.selectedCompanySales.chartBundle.find(b => b.key === this.selectedChartBundleKey);
        this.selectedChartBundleLocalizedTitles = chartBundle.titles;
        this.selectedChartBundleIsTimeChart = chartBundle.isTimeChart;
        this.selectedChartBundlePeriodType = chartBundle.periodType;

        const useReportingValue = false;
        const currency = useReportingValue ? chartBundle.reportingCurrency : chartBundle.currency;
        const chart = chartBundle.charts.find(c => c.valueType === this.valueType);

        const currentYearSerie = this.getSerieWithKey(chartBundle.series, this.currentYearSeriesKey);
        const previousYearSerie = this.getSerieWithKey(chartBundle.series, this.previousYearSeriesKey);

        if (this.viewType === 'chart') {
            this.chartData = {
                chart: chart,
                chartBundle: chartBundle,
                period: this.selectedPeriod,
                currency: currency,
                useReportingValue: useReportingValue,
                previousYearSerie: previousYearSerie,
                currentYearSerie: currentYearSerie,
                currentYearAccentColor: this.currentYearAccentColor,
                currentYearAccentColorWithTransparency: this.currentYearAccentColorWithTransparency,
                previouseYearAccentColor: this.previouseYearAccentColor,
                previouseYearAccentColorWithTransparency: this.previouseYearAccentColorWithTransparency
            };
        } else {
            this.tableData = {
                chart: chart,
                previousYearSerie: previousYearSerie,
                currentYearSerie: currentYearSerie,
                useReportingValue: useReportingValue,
                currency: currency
            };
        }

        // extra info
        this.extraInfoValue = '';
        if (chartBundle.isTimeChart) {
            const totalDataSet = chart.dataSet.find(ds => ds.hasTotal);
            if (totalDataSet) {
                const totalDataPoint = totalDataSet.dataPoints.find(dp => dp.isTotal);

                if (totalDataPoint) {
                    const value = this.getCorrectValue(totalDataPoint.values[1], useReportingValue);
                    const moneyValue = this.currencyPipe.transform(value, currency);
                    this.extraInfoValue = `#Total sales: ${moneyValue}`;
                }
            }
        } else {
            const dataSet = chart.dataSet.find(ds => ds.period === this.selectedPeriod);
            if (dataSet) {
                const othersDataPoint = dataSet.dataPoints.find(dp => dp.label === '@@OTHERS@@');
                const totalsDataPoint = dataSet.dataPoints.find(dp => dp.isTotal);
                if (othersDataPoint && totalsDataPoint) {
                    const otherValue = this.getCorrectValue(othersDataPoint.values[1], useReportingValue);
                    const totalValue = this.getCorrectValue(totalsDataPoint.values[1], useReportingValue);
                    const moneyValue = this.currencyPipe.transform(otherValue, currency);
                    const ratioPercentage = this.calcPercentageRatioBetweenTwoNumbers(otherValue, otherValue + totalValue, true);
                    const rationString = ratioPercentage === 0 ? 'N/A' : `${ratioPercentage}%`;
                    this.extraInfoValue = `#Others: ${moneyValue} // ${rationString}`;
                }
            }
        }
    }

    private updateFooterMenu(companySales: CompanySales) {

        const currentLanguage = this.localeService.language;

        const chartItems = companySales.chartBundle.map(cb => ({
            key: cb.key,
            label: cb.titles[currentLanguage],
            selected: () => cb.key === this.selectedChartBundleKey
        }));

        this.footerTabMenus = [
            {
                key: 'charts',
                icon: '../../../../assets/sales/footer-menu-charts.png',
                items: chartItems
            },
            {
                key: 'salesperson',
                icon: '../../../../assets/sales/footer-menu-salesperson.png',
                items: [
                    {
                        key: 'sp1',
                        label: 'Sales Person 1'
                    },
                    {
                        key: 'sp2',
                        label: 'Sales Person 2'
                    }
                ]
            },
            {
                key: 'share',
                icon: '../../../../assets/sales/footer-menu-share.png',
                items: [
                    {
                        key: 'send_chart_by_email',
                        label: 'Send chart by email'
                    },
                    {
                        key: 'send_pdf_chart_by_email',
                        label: 'Send PDF chart by email'
                    },
                    {
                        key: 'save_image_in_the_gallery',
                        label: 'Save Image in the gallery'
                    }
                ]
            }
        ];
    }

    private getCorrectValue(value: { seriesKey: string, value: number, reportingValue: number }, useReportingValue: boolean): number {
        return useReportingValue ? value.reportingValue : value.value;
    }

    private calcPercentageRatioBetweenTwoNumbers(valueA: number, valueB: number, roundValue?: boolean) {
        if (!valueB || valueB === 0) {
            return 0;
        }

        let ratio = (valueA / valueB) * 100;
        ratio = roundValue ? Math.round(ratio) : ratio;
        return ratio;
    }

    private getSerieWithKey(series: Serie[], key: string): Serie {
        if (!series) {
            return null;
        }

        return series.find(s => s.key === key);
    }
}
