import { Component, ViewChild, OnInit } from '@angular/core';

import { Chart } from 'chart.js';
import { PopoverController, LoadingController } from '@ionic/angular';
import { CompanySelectorComponent, FooterTabMenu, FooterMenuItemSelectedEvent } from '../../components';
import { PageBase } from '../../../shared/pages';
import { SalesService, SalesServiceProvider } from '../../services';
import { Company, SalesCharts, CompanySales, ChartBundle } from '../../entities';
import { LocaleService } from '../../../core/services';

@Component({
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    providers: [SalesServiceProvider]
})
export class HomePage extends PageBase implements OnInit {

    private readonly yAxisNumberOfSteps = 4;

    private chart: any;
    private companies: Company[];
    private salesCharts: SalesCharts;
    private yAxisMaxValues: number[];

    selectedCompanySales: CompanySales;
    selectedChartBundle: ChartBundle;
    showTimeFrameSelector: boolean;

    yAxisScaleStep: number;
    yAxisScaleUnitPrefix: string;

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
        private localeService: LocaleService
    ) {

        super(loadingController);

        this.dataDate = new Date();
        this.timeFrame = 'monthly';
        this.valueType = 'abs';
        this.viewType = 'chart';
        this.showTimeFrameSelector = true;

        this.yAxisMaxValues = this.getPossibleMaximumYValues(this.yAxisNumberOfSteps);
    }

    async ngOnInit() {

        await this.showLoading();

        // get sales charts
        this.salesCharts = await this.salesService.getSalesCharts();

        // extract info from all companies
        this.companies = this.salesCharts.data.map(cs => ({ key: cs.key, name: cs.name }));

        // by default, select the first company
        this.selectedCompanySales = this.salesCharts.data[0];

        // by default, select the first chart bundle
        this.selectedChartBundle = this.selectedCompanySales.chartBundle[0];

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
        if (event.menu.key !== 'share') {
            // for (const menuItem of event.menu.items) {
            //     menuItem.selected = menuItem === event.menuItem;
            // }
        }
    }

    private updateView() {
        this.updateFooterMenu(this.selectedCompanySales);
        this.updateChart(this.selectedChartBundle, this.valueType, this.timeFrame);
    }

    private updateChart(chartBundle: ChartBundle, valueType: 'abs' | 'accum', timeFrame: 'monthly' | 'quarter') {


        const chart = chartBundle.charts.find(c => c.valueType === valueType);
        const chartType = valueType === 'accum' && chartBundle.isTimeChart ? 'line' : 'bar';
        const datasets = [];
        let labels: string[];

        let maxValue = 0;
        for (const serie of chartBundle.series) {
            const dataSet = {
                label: serie.legend,
                data: [],
                backgroundColor: serie.key === '0' ? '#DBE0EB' : '#1D317D'
            };

            labels = [];

            for (const ds of chart.dataSet) {
                const dataPoint = ds.dataPoints[0];

                // if "is total", this value is not presented on the chart
                if (dataPoint.isTotal) {
                    continue;
                }

                labels.push(dataPoint.label);

                const value = dataPoint.values.find(v => v.seriesKey === serie.key);
                if (value) {
                    maxValue = value.value > maxValue ? value.value : maxValue;
                    dataSet.data.push(value.value);
                } else {
                    dataSet.data.push(0);
                }
            }

            datasets.push(dataSet);
        }

        const yAxisMaxValueStepAndUnit = this.calcYAxisMaxValueStepAndUnit(maxValue, this.yAxisNumberOfSteps, this.yAxisMaxValues);
        this.yAxisScaleStep = yAxisMaxValueStepAndUnit.yAxisScaleStep;
        this.yAxisScaleUnitPrefix = yAxisMaxValueStepAndUnit.yAxisScaleUnitPrefix;
        const yAxisMaxValue = yAxisMaxValueStepAndUnit.yAxisMaxValue;

        if (this.chart && chartType !== this.chart.config.type) {
            this.chart.destroy();
            this.chart = null;
        }

        if (this.chart) {
            this.chart.type = chartType;
            this.chart.data.labels = labels;
            this.chart.data.datasets = datasets;
            this.chart.update();
        } else {
            this.chart = new Chart(this.chartCanvas.nativeElement, {
                type: chartType,
                data: {
                    labels: labels,
                    datasets: datasets,
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    legend: {
                        display: false
                    },
                    scales: {
                        yAxes: [{
                            display: false,
                            ticks: {
                                beginAtZero: true,
                                maxTicksLimit: this.yAxisNumberOfSteps,
                                max: yAxisMaxValue
                            }
                        }],
                        xAxes: [
                            {
                                display: true,
                                gridLines: {
                                    display: false
                                }
                            }
                        ]
                    }
                }
            });
        }


        // let chartType: string;

        // const lastYearValues = [10, 12, 3, 5, 2, 3, 5, 12, 5, 8, 9, 12];
        // const currentYearValues = [5, 6, 6, 12, 5, 1, 11, 3, 2, 6, 4, 2];

        // let lastYearDatasetValues: number[] = [];
        // let currentYearDatasetValues: number[] = [];

        // switch (valueType) {
        //     case 'abs': {
        //         chartType = 'bar';
        //         currentYearDatasetValues = currentYearValues;
        //         lastYearDatasetValues = lastYearValues;
        //     }
        //     break;
        //     case 'accum': {
        //         chartType = 'line';

        //         currentYearDatasetValues = this.accumulateValues(currentYearValues);
        //         lastYearDatasetValues = this.accumulateValues(lastYearValues);
        //     }
        //     break;
        // }

        // switch (timeFrame) {
        //     case 'monthly': {
        //         labels = ['jan', 'feb', 'mar', 'apr', 'may', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        //     }
        //     break;   
        //     case 'quarter': {
        //         labels = ['Q1', 'Q2', 'Q3', 'Q4'];
        //         currentYearDatasetValues = this.aggregateValues(currentYearDatasetValues, 3);
        //         lastYearDatasetValues = this.aggregateValues(lastYearDatasetValues, 3);
        //     }
        //     break;
        // }

        // if (this.chart && chartType !== this.chart.config.type) {
        //     this.chart.destroy();
        //     this.chart = null;
        // }

        // if (this.chart) {
        //     this.chart.type = chartType;
        //     this.chart.data.labels = labels;
        //     this.chart.data.datasets[0].data = currentYearDatasetValues;
        //     this.chart.data.datasets[1].data = lastYearDatasetValues;
        //     this.chart.update();
        // } else {
        //     this.chart = new Chart(this.chartCanvas.nativeElement, {
        //         type: chartType,
        //         data: {
        //             labels: labels,
        //             datasets: [
        //                 {
        //                     label: '2018',
        //                     data: currentYearDatasetValues,
        //                     backgroundColor: 'rgba(81, 131, 255, .85)'
        //                 },
        //                 {
        //                     label: '2017',
        //                     data: lastYearDatasetValues,
        //                     backgroundColor: 'rgba(204, 204, 204, .85)'
        //                 }
        //             ],
        //         },
        //         options: {
        //             responsive: true,
        //             maintainAspectRatio: false,
        //             scales: {
        //                 yAxes: [{
        //                     ticks: {
        //                         beginAtZero: true
        //                     }
        //                 }],
        //                 xAxes: [
        //                     {
        //                         display: true,
        //                         gridLines: {
        //                             display: false
        //                         }
        //                     }
        //                 ]
        //             }
        //         }
        //     });
        // }
    }

    private updateFooterMenu(companySales: CompanySales) {

        const currentLanguage = this.localeService.language;

        const chartItems = companySales.chartBundle.map(cb => ({
            key: cb.key,
            label: cb.titles[currentLanguage],
            selected: () => cb.key === this.selectedChartBundle.key
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

    private accumulateValues(values: number[]): number[] {
        let accomulatedValue = 0;
        const accumulatedValues = [];
        for (let i = 0; i < values.length; i++) {
            accomulatedValue += values[i];
            accumulatedValues.push(accomulatedValue);
        }

        return accumulatedValues;
    }

    private aggregateValues(values: number[], amount: number) {
        const aggregatedValues = [];
        let aggregatedValue = 0;

        for (let i = 0; i < values.length; i++) {
            aggregatedValue += values[i];
            aggregatedValues.push(aggregatedValue);

            if (i % amount === 0) {
                aggregatedValues.push(aggregatedValue);
                aggregatedValue = 0;
            }
        }

        if (aggregatedValue !== 0) {
            aggregatedValues.push(aggregatedValue);
        }

        return aggregatedValues;
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
}
