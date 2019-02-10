import { Injectable } from '@angular/core';
import { LocalizedStringsPipe, CurrencySymbolPipe, LocaleCurrencyPipe, LocaleDatePipe } from '../../shared/pipes';
import { TranslateService } from '@ngx-translate/core';
import { SalesChartData } from '../components/sales-chart/entities';
import { SalesTableData } from '../components/sales-table/entities';

/**
 * Provide tools to share charts in image and pdf format.
 *
 * @export
 * @class ChartShareService
 */
@Injectable({
    providedIn: 'root',
})
export class ChartShareService {

    /**
     *
     */
    constructor(
        private translate: TranslateService,
        private localeDatePipe: LocaleDatePipe,
        private localeCurrencyPipe: LocaleCurrencyPipe,
        private localizedStringsPipe: LocalizedStringsPipe,
        private currencySymbolPipe: CurrencySymbolPipe
        ) {

    }

    async storeChartImageOnDeviceGallery(
        chartCanvas: HTMLCanvasElement,
        chartLocalizedTitle: { [key: string]: string },
        chartCompanyKey: string,
        chartDataDate: Date,
        chartPeriodType: 'M'|'W',
        chartValueType: 'abs'|'accum',
        chartIsTimeChart: boolean,
        chartSelectedPeriod: string,
        chartExtraInfoValue: string,
        salesChartData: SalesChartData,
        salesTableData: SalesTableData,
        ) {

        const image = await this.buildBase64Image(
            chartCanvas,
            chartLocalizedTitle,
            chartCompanyKey,
            chartDataDate,
            chartPeriodType,
            chartValueType,
            chartIsTimeChart,
            chartSelectedPeriod,
            chartExtraInfoValue,
            salesChartData,
            salesTableData
        );
    }

    async shareChartImageByEmail(
        chartCanvas: HTMLCanvasElement,
        chartLocalizedTitle: { [key: string]: string },
        chartCompanyKey: string,
        chartDataDate: Date,
        chartPeriodType: 'M'|'W',
        chartValueType: 'abs'|'accum',
        chartIsTimeChart: boolean,
        chartSelectedPeriod: string,
        chartExtraInfoValue: string,
        salesChartData: SalesChartData,
        salesTableData: SalesTableData,
        ) {

        const image = await this.buildBase64Image(
            chartCanvas,
            chartLocalizedTitle,
            chartCompanyKey,
            chartDataDate,
            chartPeriodType,
            chartValueType,
            chartIsTimeChart,
            chartSelectedPeriod,
            chartExtraInfoValue,
            salesChartData,
            salesTableData
        );
    }

    async shareChartPdfByEmail(
        chartCanvas: HTMLCanvasElement,
        chartLocalizedTitle: { [key: string]: string },
        chartCompanyKey: string,
        chartDataDate: Date,
        chartPeriodType: 'M'|'W',
        chartValueType: 'abs'|'accum',
        chartIsTimeChart: boolean,
        chartSelectedPeriod: string,
        chartExtraInfoValue: string,
        salesChartData: SalesChartData,
        salesTableData: SalesTableData,
        ) {

        const image = await this.buildBase64Image(
            chartCanvas,
            chartLocalizedTitle,
            chartCompanyKey,
            chartDataDate,
            chartPeriodType,
            chartValueType,
            chartIsTimeChart,
            chartSelectedPeriod,
            chartExtraInfoValue,
            salesChartData,
            salesTableData
        );
    }

    private async buildBase64Image(
        chartCanvas: HTMLCanvasElement,
        chartLocalizedTitle: { [key: string]: string },
        chartCompanyKey: string,
        chartDataDate: Date,
        chartPeriodType: 'M'|'W',
        chartValueType: 'abs'|'accum',
        chartIsTimeChart: boolean,
        chartSelectedPeriod: string,
        chartExtraInfoValue: string,
        salesChartData: SalesChartData,
        salesTableData: SalesTableData,
        ): Promise<string> {

        const canvas = document.createElement('canvas');
        canvas.width = 2500;

        if (chartPeriodType === 'M') {
            if (chartIsTimeChart) {
                canvas.height = 1500; // monthly chart
            } else {
                canvas.height = 1800; // top 5 charts
            }
        } else {
            canvas.height = 7600; // weekly chart
        }

        const ctx = canvas.getContext('2d');

        // default definitions
        ctx.textBaseline = 'top';

        // title
        const chartName = this.localizedStringsPipe.transform(chartLocalizedTitle).toUpperCase();
        const aggregationResourceKey = chartValueType === 'abs' ? 'SALES.SHARE_CHARTS.ABSOLUTE' : 'SALES.SHARE_CHARTS.ACCUMULATED';
        const aggregation = await this.translate.get(aggregationResourceKey).toPromise();
        let period = '';

        if (!chartIsTimeChart) {
            period = await this.translate.get(`SHARED.DATES.MONTHS.${chartSelectedPeriod}`).toPromise();
            period = `(${period.slice(0, 3).toLocaleLowerCase()}) `;
        }

        const title = `${chartName} ${period}- ${aggregation}`;
        ctx.font = 'bold 50px Open Sans Condensed';
        ctx.fillStyle = '#000';
        ctx.fillText(title, 100, 100);

        // COMPANY
        ctx.font = '50px Open Sans Condensed';
        ctx.fillStyle = '#1C307D';
        ctx.fillText(chartCompanyKey, 100, 180);

        // DATE
        const date = this.localeDatePipe.transform(chartDataDate, 'medium');
        ctx.font = '50px Open Sans Condensed';
        ctx.fillStyle = '#000';
        ctx.fillText(date, 100, 260);

        // CHARTS
        const chartPosX = 170;
        const chartPosY = 500;
        let chartHeight: number;
        // const chartCanvas = document.getElementsByTagName('canvas')[0];
        // chartCanvas.getContext('2d').strokeRect(0, 0, chartCanvas.width - 1, chartCanvas.height - 1);

        if (chartPeriodType === 'W') {
            chartHeight = 1020;
            const chartWidth = ((chartCanvas.width * 1020) / chartCanvas.height);
            const chartMargin = {
                top: 115,
                right: 0,
                bottom: 115,
                left: 50
            };

            const tempCanvas = document.createElement('canvas');
            tempCanvas.height = chartHeight + chartMargin.top + chartMargin.bottom;
            tempCanvas.width = chartWidth + chartMargin.left + chartMargin.right;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.textBaseline = 'top';

            tempCtx.drawImage(chartCanvas, chartMargin.left, chartMargin.top, tempCanvas.width, chartHeight);

            // CHART SERIES LEGEND
            tempCtx.font = '40px Open Sans Condensed';
            // current year
            tempCtx.fillStyle = '#000';
            tempCtx.fillText(salesChartData.currentYearLegend, tempCanvas.width - 30 - 80 - 140, 0);
            tempCtx.fillStyle = '#1C307D';
            tempCtx.fillRect(tempCanvas.width - 30 - 140, 0, 30, 30);

            // previouse year
            tempCtx.fillStyle = '#000';
            tempCtx.fillText(salesChartData.previousYearLegend, tempCanvas.width - 30 - 80, 0);
            tempCtx.fillStyle = '#DBE0EB';
            tempCtx.fillRect(tempCanvas.width - 30, 0, 30, 30);

            // y axis
            // 0.0682 => percentual height of legend + top chart margin
            const stepDelta = ((chartHeight - chartHeight * 0.0682) / 4) - 1;

            // 0.0124 => percentual height of top chart margin
            // 115 => chart padding
            const stepCompensation = chartHeight * 0.0124 + chartMargin.top;
            tempCtx.fillStyle = '#000';
            tempCtx.fillRect(chartMargin.left, stepDelta * 0 + stepCompensation, chartWidth, 1);
            tempCtx.fillRect(chartMargin.left, stepDelta * 1 + stepCompensation, chartWidth, 1);
            tempCtx.fillRect(chartMargin.left, stepDelta * 2 + stepCompensation, chartWidth, 1);
            tempCtx.fillRect(chartMargin.left, stepDelta * 3 + stepCompensation, chartWidth, 1);

            tempCtx.font = 'bold 30px Open Sans Condensed';
            tempCtx.textAlign = 'right';
            tempCtx.textBaseline = 'middle';
            const yAxisScaleYConstant = stepCompensation;
            const scaleStep = salesChartData.yAxisScaleStep;
            tempCtx.fillText(`${scaleStep * 4}`, chartMargin.left - 5, yAxisScaleYConstant + stepDelta * 0);
            tempCtx.fillText(`${scaleStep * 3}`, chartMargin.left - 5, yAxisScaleYConstant + stepDelta * 1);
            tempCtx.fillText(`${scaleStep * 2}`, chartMargin.left - 5, yAxisScaleYConstant + stepDelta * 2);
            tempCtx.fillText(`${scaleStep * 1}`, chartMargin.left - 5, yAxisScaleYConstant + stepDelta * 3);

            // y axis units
            // rotate 90deg
            tempCtx.save();
            tempCtx.translate(30, 50);
            tempCtx.rotate(-Math.PI / 2);
            tempCtx.textAlign = 'center';
            const currencySymbol = this.currencySymbolPipe.transform(salesChartData.currentCurrency);
            tempCtx.fillText(`${salesChartData.yAxisScaleUnitPrefix}(${currencySymbol})`, 0, 0);
            tempCtx.restore();

            // this.imgSrc = tempCanvas.toDataURL();

            ctx.save();
            // ctx.translate(tempCanvas.height, 400);
            ctx.translate(1250, 400);
            ctx.rotate(Math.PI / 2);
            ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height);
            ctx.restore();

            chartHeight = tempCanvas.width;
        } else {
            // CHART SERIES LEGEND
            ctx.font = '40px Open Sans Condensed';
            // current year
            ctx.fillStyle = '#000';
            ctx.fillText(salesChartData.currentYearLegend, 935, 400);
            ctx.fillStyle = '#1C307D';
            ctx.fillRect(1010, 400, 30, 30);

            // previouse year
            ctx.fillStyle = '#000';
            ctx.fillText(salesChartData.previousYearLegend, 1070, 400);
            ctx.fillStyle = '#DBE0EB';
            ctx.fillRect(1150, 400, 30, 30);

            // draw chart
            chartHeight = (chartCanvas.height * 1020) / chartCanvas.width;
            ctx.drawImage(chartCanvas, chartPosX, chartPosY, 1020, chartHeight);

            // draw scale
            // 0.0682 => percentual height of legend + top chart margin
            const stepDelta = (chartHeight - chartHeight * 0.0682) / 4;

            // 0.0124 => percentual height of top chart margin
            const stepCompensation = chartHeight * 0.0124;

            ctx.fillStyle = '#000';
            ctx.fillRect(chartPosX, chartPosY + stepDelta * 0 + stepCompensation, 1020, 1);
            ctx.fillRect(chartPosX, chartPosY + stepDelta * 1 + stepCompensation, 1020, 1);
            ctx.fillRect(chartPosX, chartPosY + stepDelta * 2 + stepCompensation, 1020, 1);
            ctx.fillRect(chartPosX, chartPosY + stepDelta * 3 + stepCompensation, 1020, 1);
            ctx.fillRect(chartPosX, chartPosY + stepDelta * 4 + stepCompensation, 1020, 1);

            ctx.font = 'bold 30px Open Sans Condensed';
            ctx.textAlign = 'right';
            const yAxisScaleYConstant =  chartPosY + stepCompensation - 5;
            ctx.fillText(`${salesChartData.yAxisScaleStep * 4}`, chartPosX - 20, yAxisScaleYConstant + stepDelta * 0);
            ctx.fillText(`${salesChartData.yAxisScaleStep * 3}`, chartPosX - 20, yAxisScaleYConstant + stepDelta * 1);
            ctx.fillText(`${salesChartData.yAxisScaleStep * 2}`, chartPosX - 20, yAxisScaleYConstant + stepDelta * 2);
            ctx.fillText(`${salesChartData.yAxisScaleStep * 1}`, chartPosX - 20, yAxisScaleYConstant + stepDelta * 3);

            // y axis units
            // rotate 90deg
            ctx.save();
            ctx.translate(chartPosX - 50, chartPosY - 70);
            ctx.rotate(-Math.PI / 2);
            ctx.textAlign = 'center';
            const currencySymbol = this.currencySymbolPipe.transform(salesChartData.currentCurrency);
            ctx.fillText(`${salesChartData.yAxisScaleUnitPrefix}(${currencySymbol})`, 0, 0);
            ctx.restore();


        }

        // chart extra  info
        ctx.font = '40px Open Sans Condensed';
        ctx.textAlign = 'center';
        ctx.fillText(chartExtraInfoValue, 625, chartPosY + chartHeight + 100);


        // TABLE
        // TABLE SERIES LEGEND

        const padding = 1180;
        ctx.font = '40px Open Sans Condensed';
        ctx.textAlign = 'left';
        // current year
        ctx.fillStyle = '#000';
        ctx.fillText(salesTableData.currentYearLabel, 2120, 400);
        ctx.fillStyle = '#1C307D';
        ctx.fillRect(2196, 400, 30, 30);

        // previouse year
        ctx.fillStyle = '#000';
        ctx.fillText(salesTableData.previouseYearLabel, 2250, 400);
        ctx.fillStyle = '#DBE0EB';
        ctx.fillRect(2330, 400, 30, 30);

        // DRAW TABLE
        ctx.fillStyle = '#000';
        ctx.font = '30px Open Sans Condensed';
        const rowHeight = 50;
        const tableInitialPosition = 500;
        let tableRowYPosition = tableInitialPosition;

        let isFirstRow = true;
        for (const rowData of salesTableData.rows) {
            if (rowData.isTotal) {
                ctx.font = 'bold 30px Open Sans Condensed';
            }

            // bottom line
            if (!isFirstRow) {
                ctx.fillStyle = '#000';
                ctx.fillRect(1350, tableRowYPosition - 15, 1020, 1);
            }
            isFirstRow = false;

            // legend
            ctx.fillStyle = 'gray';
            ctx.textAlign = 'left';
            ctx.fillText(rowData.label, 1350, tableRowYPosition);

            // curre
            const currentValue = this.localeCurrencyPipe.transform(rowData.currentYearValue, salesTableData.currency);
            ctx.textAlign = 'right';
            ctx.fillStyle = 'blue';
            ctx.fillText(currentValue, 1850, tableRowYPosition);
            // prev
            const prevValue = this.localeCurrencyPipe.transform(rowData.previousYearValue, salesTableData.currency);
            ctx.fillStyle = 'gray';
            ctx.fillText(prevValue, 2250, tableRowYPosition);
            // delta
            ctx.fillStyle = rowData.deltaPercentageValue >= 0 ? 'green' : 'red';
            ctx.fillText(`${Math.round(rowData.deltaPercentageValue)}%`, 2370, tableRowYPosition);

            tableRowYPosition += rowHeight;
        }

        // table extra info
        ctx.fillStyle = '#000';
        ctx.font = '40px Open Sans Condensed';
        ctx.textAlign = 'center';
        ctx.fillText(chartExtraInfoValue, 1875, tableRowYPosition + 100);

        // LEGEND
        if (!chartIsTimeChart) {
            ctx.fillStyle = '#000';
            ctx.font = '40px Open Sans Condensed';
            ctx.textAlign = 'left';
            let legendYPosition = chartPosY + chartHeight + 200;
            for (const rowData of salesTableData.rows) {
                if (!rowData.isTotal) {
                    ctx.fillText(`${rowData.label} - ${rowData.description}`, 100, legendYPosition);
                    legendYPosition += 45;
                }
            }
        }

        const base64Image = canvas.toDataURL();

        return base64Image;
    }
}
