import * as jsPDF from 'jspdf';

import { Injectable } from '@angular/core';
import { LocalizedStringsPipe, CurrencySymbolPipe, LocaleCurrencyPipe, LocaleDatePipe } from '../../shared/pipes';
import { TranslateService } from '@ngx-translate/core';
import { SalesChartData } from '../components/sales-chart/entities';
import { SalesTableData } from '../components/sales-table/entities';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { File } from '@ionic-native/file/ngx';
import { Platform } from '@ionic/angular';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { ChartPeriodType } from '../entities';

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
     * Creates an instance of ChartShareService.
     * @param {TranslateService} translate
     * @param {Platform} platform
     * @param {Base64ToGallery} base64ToGallery
     * @param {AndroidPermissions} androidPermissions
     * @param {LocaleDatePipe} localeDatePipe
     * @param {LocaleCurrencyPipe} localeCurrencyPipe
     * @param {LocalizedStringsPipe} localizedStringsPipe
     * @param {CurrencySymbolPipe} currencySymbolPipe
     * @memberof ChartShareService
     */
    constructor(
        private translate: TranslateService,
        private platform: Platform,
        private base64ToGallery: Base64ToGallery,
        private androidPermissions: AndroidPermissions,
        private file: File,
        private emailComposer: EmailComposer,
        private localeDatePipe: LocaleDatePipe,
        private localeCurrencyPipe: LocaleCurrencyPipe,
        private localizedStringsPipe: LocalizedStringsPipe,
        private currencySymbolPipe: CurrencySymbolPipe
    ) {

    }

    /**
     * Store the chart image on the device photo gallery
     *
     * @param {HTMLCanvasElement} chartCanvas
     * @param {{ [key: string]: string }} chartLocalizedTitle
     * @param {string} chartCompanyKey
     * @param {Date} chartDataDate
     * @param {('M'|'W')} chartPeriodType
     * @param {('abs'|'accum')} chartValueType
     * @param {boolean} chartIsTimeChart
     * @param {string} chartSelectedPeriod
     * @param {string} chartExtraInfoValue
     * @param {SalesChartData} salesChartData
     * @param {SalesTableData} salesTableData
     * @returns {Promise<boolean>}
     * @memberof ChartShareService
     */
    async storeChartImageOnDeviceGallery(
        chartCanvas: HTMLCanvasElement,
        chartLocalizedTitle: { [key: string]: string },
        chartCompanyKey: string,
        chartDataDate: Date,
        chartPeriodType: ChartPeriodType,
        chartValueType: 'abs' | 'accum',
        chartIsTimeChart: boolean,
        chartSelectedPeriod: string,
        chartExtraInfoValue: string,
        salesChartData: SalesChartData,
        salesTableData: SalesTableData,
        currentYearAccentColor: string,
        previousYearAccentColor: string
    ): Promise<boolean> {

        const imageData = await this.buildBase64Image(
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
            salesTableData,
            currentYearAccentColor,
            previousYearAccentColor
        );

        const hasStoragePermission = await this.hasStoragePermission();

        if (hasStoragePermission) {
            try {
                await this.base64ToGallery.base64ToGallery(imageData.image, { prefix: 'sales_chart', mediaScanner: false });
            } catch (error) {
                console.log(error);
                return false;
            }
        } else {
            return false;
        }

        return true;
    }

    /**
     * Send the image chart by email.
     *
     * @param {HTMLCanvasElement} chartCanvas
     * @param {{ [key: string]: string }} chartLocalizedTitle
     * @param {string} chartCompanyKey
     * @param {Date} chartDataDate
     * @param {('M' | 'W')} chartPeriodType
     * @param {('abs' | 'accum')} chartValueType
     * @param {boolean} chartIsTimeChart
     * @param {string} chartSelectedPeriod
     * @param {string} chartExtraInfoValue
     * @param {SalesChartData} salesChartData
     * @param {SalesTableData} salesTableData
     * @returns {Promise<boolean>}
     * @memberof ChartShareService
     */
    async shareChartImageByEmail(
        chartCanvas: HTMLCanvasElement,
        chartLocalizedTitle: { [key: string]: string },
        chartCompanyKey: string,
        chartDataDate: Date,
        chartPeriodType: ChartPeriodType,
        chartValueType: 'abs' | 'accum',
        chartIsTimeChart: boolean,
        chartSelectedPeriod: string,
        chartExtraInfoValue: string,
        salesChartData: SalesChartData,
        salesTableData: SalesTableData,
        currentYearAccentColor: string,
        previousYearAccentColor: string
    ): Promise<boolean> {

        const imageData = await this.buildBase64Image(
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
            salesTableData,
            currentYearAccentColor,
            previousYearAccentColor
        );

        // create the email subject based on chart title and data
        const chartTitle = await this.buildChartTitle(chartLocalizedTitle, chartValueType, chartIsTimeChart, chartSelectedPeriod);
        const chartDate = this.localeDatePipe.transform(chartDataDate, 'medium');
        const emailSubject = `${chartTitle} - ${chartDate}`;

        // store the image so it can be sent as an attachment by email
        const imagePath = await this.storeImage(imageData.image);

        // send the email
        return this.sendAtachmentByEmail(emailSubject, imagePath);
    }

    async shareChartPdfByEmail(
        chartCanvas: HTMLCanvasElement,
        chartLocalizedTitle: { [key: string]: string },
        chartCompanyKey: string,
        chartDataDate: Date,
        chartPeriodType: ChartPeriodType,
        chartValueType: 'abs' | 'accum',
        chartIsTimeChart: boolean,
        chartSelectedPeriod: string,
        chartExtraInfoValue: string,
        salesChartData: SalesChartData,
        salesTableData: SalesTableData,
        currentYearAccentColor: string,
        previousYearAccentColor: string
    ) {

        const imageData = await this.buildBase64Image(
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
            salesTableData,
            currentYearAccentColor,
            previousYearAccentColor
        );

        // create pdf with with chart image
        const pdfDoc = new jsPDF();

        // calculate the image size to fit all on the pdf
        const pdfWidth = pdfDoc.internal.pageSize.getWidth();
        const pdfHeight = pdfDoc.internal.pageSize.getHeight();
        let imageWidth = pdfWidth;
        let imageHeight = (pdfWidth * imageData.size.height) / imageData.size.width;
        if (imageHeight > pdfHeight) {
            imageHeight = pdfHeight;
            imageWidth = (pdfHeight * imageData.size.width) / imageData.size.height;
        }

        pdfDoc.addImage(imageData.image, 'PNG', 0, 0, imageWidth, imageHeight);
        const pdfBlob = pdfDoc.output('blob');

        // save the pdf so it can be sent by email
        const pdfFilePath = await this.storePdf(pdfBlob);

        // build the email subject
        const chartTitle = await this.buildChartTitle(chartLocalizedTitle, chartValueType, chartIsTimeChart, chartSelectedPeriod);
        const chartDate = this.localeDatePipe.transform(chartDataDate, 'medium');
        const emailSubject = `${chartTitle} - ${chartDate}`;

        // send the email
        return this.sendAtachmentByEmail(emailSubject, pdfFilePath);

    }

    private sendAtachmentByEmail(subject: string, attachmentsFilePath: string): boolean {

        // email composition definitions
        const email = {
            attachments: [
                attachmentsFilePath
            ],
            subject: subject,
            isHtml: true
        };

        try {
            // Send a text message using default options
            this.emailComposer.open(email);
        } catch (error) {
            console.log(error);
            return false;
        }

        return true;
    }

    private async storeImage(base64Image: string): Promise<string> {
        const imageFileName = 'sales_chart.png';
        const imgBlob = this.base64toBlob(base64Image, 'image/png');

        return await this.storeFile(imgBlob, imageFileName);
    }

    private async storePdf(pdfBlob: Blob): Promise<string> {
        return await this.storeFile(pdfBlob, 'sales_chart.pdf');
    }

    private async storeFile(fileBlob: Blob, fileName: string): Promise<string> {

        // the the path where is safe to store documents
        let filepath = this.file.externalApplicationStorageDirectory;
        if (!filepath) {
            filepath = this.file.documentsDirectory;
        }

        // store the file
        await this.file.writeFile(filepath, fileName, fileBlob, { replace: true });

        // return the full path of the file
        return filepath.concat(fileName);
    }

    private async hasStoragePermission(): Promise<boolean> {

        if (!this.platform.is('android')) {
            return true;
        }

        try {
            const checkPermissionResult = await this.androidPermissions
                .checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE);


            // request permissions
            if (!checkPermissionResult.hasPermission) {
                const res = await this.androidPermissions
                    .requestPermissions([this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE]);

                return res.hasPermission;
            }

        } catch (error) {
            console.log(error);
            return false;
        }

        return true;
    }

    private async buildChartTitle(
        chartLocalizedTitle: { [key: string]: string },
        chartValueType: 'abs' | 'accum',
        chartIsTimeChart: boolean,
        chartSelectedPeriod: string
    ): Promise<string> {

        const chartName = this.localizedStringsPipe.transform(chartLocalizedTitle).toUpperCase();
        const aggregationResourceKey = chartValueType === 'abs' ? 'SALES.SHARE_CHARTS.ABSOLUTE' : 'SALES.SHARE_CHARTS.ACCUMULATED';
        const aggregation = await this.translate.get(aggregationResourceKey).toPromise();
        let period = '';

        if (!chartIsTimeChart) {
            period = await this.translate.get(`SHARED.DATES.MONTHS.${chartSelectedPeriod}`).toPromise();
            period = `(${period.slice(0, 3).toLocaleLowerCase()}) `;
        }

        return `${chartName} ${period}- ${aggregation}`;
    }

    private base64toBlob(base64Data: string, contentType: string): Blob {
        const base64slices = base64Data.split(',');
        base64Data = base64slices.length === 2 ? base64slices[1] : base64Data;
        contentType = contentType || '';
        const sliceSize = 1024;
        const byteCharacters = atob(base64Data);
        const bytesLength = byteCharacters.length;
        const slicesCount = Math.ceil(bytesLength / sliceSize);
        const byteArrays = new Array(slicesCount);

        for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
            const begin = sliceIndex * sliceSize;
            const end = Math.min(begin + sliceSize, bytesLength);

            const bytes = new Array(end - begin);
            for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
                bytes[i] = byteCharacters[offset].charCodeAt(0);
            }
            byteArrays[sliceIndex] = new Uint8Array(bytes);
        }
        return new Blob(byteArrays, { type: contentType });
    }

    private async buildBase64Image(
        chartCanvas: HTMLCanvasElement,
        chartLocalizedTitle: { [key: string]: string },
        chartCompanyKey: string,
        chartDataDate: Date,
        chartPeriodType: ChartPeriodType,
        chartValueType: 'abs' | 'accum',
        chartIsTimeChart: boolean,
        chartSelectedPeriod: string,
        chartExtraInfoValue: string,
        salesChartData: SalesChartData,
        salesTableData: SalesTableData,
        currentYearAccentColor: string,
        previousYearAccentColor: string
    ): Promise<{image: string, size: { width: number, height: number}}> {

        const canvas = document.createElement('canvas');
        canvas.width = 2500;

        if (chartPeriodType === ChartPeriodType.Month) {
            if (chartIsTimeChart) {
                canvas.height = chartCanvas.height + 750; // monthly chart
            } else {
                canvas.height = chartCanvas.height + 1000; // top 5 charts
            }
        } else {
            canvas.height = chartCanvas.width + 550; // weekly chart
        }

        const ctx = canvas.getContext('2d');

        // fill with white
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // default definitions
        ctx.textBaseline = 'top';

        // title
        const title = await this.buildChartTitle(chartLocalizedTitle, chartValueType, chartIsTimeChart, chartSelectedPeriod);
        ctx.font = 'bold 50px Open Sans Condensed';
        ctx.fillStyle = '#000';
        ctx.fillText(title, 100, 100);

        // COMPANY
        ctx.font = '50px Open Sans Condensed';
        ctx.fillStyle = currentYearAccentColor;
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

        if (chartPeriodType === ChartPeriodType.Week) {
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
            tempCtx.fillStyle = currentYearAccentColor;
            tempCtx.fillRect(tempCanvas.width - 30 - 140, 0, 30, 30);

            // previouse year
            tempCtx.fillStyle = '#000';
            tempCtx.fillText(salesChartData.previousYearLegend, tempCanvas.width - 30 - 80, 0);
            tempCtx.fillStyle = previousYearAccentColor;
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
            ctx.fillStyle = currentYearAccentColor;
            ctx.fillRect(1010, 400, 30, 30);

            // previouse year
            ctx.fillStyle = '#000';
            ctx.fillText(salesChartData.previousYearLegend, 1070, 400);
            ctx.fillStyle = previousYearAccentColor;
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
            const yAxisScaleYConstant = chartPosY + stepCompensation - 5;
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
        ctx.fillStyle = currentYearAccentColor;
        ctx.fillRect(2196, 400, 30, 30);

        // previouse year
        ctx.fillStyle = '#000';
        ctx.fillText(salesTableData.previouseYearLabel, 2250, 400);
        ctx.fillStyle = previousYearAccentColor;
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
            ctx.fillStyle = currentYearAccentColor;
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

        // create a canvas to reduce the final image size
        const finalImageCanvas = document.createElement('canvas');
        finalImageCanvas.width = 1500;
        finalImageCanvas.height = (finalImageCanvas.width * canvas.height) / canvas.width;

        // add the canvas to the resized canvas
        const finalImageCanvasCtx = finalImageCanvas.getContext('2d');
        finalImageCanvasCtx.drawImage(canvas, 0, 0, finalImageCanvas.width, finalImageCanvas.height);

        // generate the image
        const base64Image = finalImageCanvas.toDataURL();

        return {
            image: base64Image,
            size: {
                width: finalImageCanvas.width,
                height: finalImageCanvas.height
            }
        };
    }
}
