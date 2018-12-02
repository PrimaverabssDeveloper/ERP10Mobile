import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MoneyValue, LocalizedString } from '../../../core/entities';
import { DocumentValue, DocumentValueType, DocumentLine, FinantialDocumentLineRowConfiguration } from '../../entities';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { LocaleService } from '../../../core/services';
import { DocumentValueService } from '../../services';

@Component({
    selector: 'finantial-document-line-row',
    templateUrl: './finantial-document-line-row.component.html',
    styleUrls: ['./finantial-document-line-row.component.scss'],
})
export class FinantialDocumentLineRowComponent {
    private _documentLine: DocumentLine;
    private _configuration: FinantialDocumentLineRowConfiguration;
    private _rowIndex: number;

    @Input() set rowIndex(rowIndex: number) {
        this._rowIndex = rowIndex;
        this.updateView(this._rowIndex, this._documentLine, this._configuration);
    }

    @Input() set documentLine(line: DocumentLine) {
        this._documentLine = line;
        this.updateView(this._rowIndex, this._documentLine, this._configuration);
    }

    @Input() set configuration(configuration: FinantialDocumentLineRowConfiguration) {
        this._configuration = configuration;
        this.updateView(this._rowIndex, this._documentLine, this._configuration);
    }

    index: string;
    title: string;
    leftValueTitle: string;
    leftValue: string;
    rightValueTitle: string;
    rightValue: string;
    colorClass: string;


    constructor(
        private documentValueService: DocumentValueService,
    ) {
        this._rowIndex = -1;
    }

    private updateView(rowIndex: number, documentLine: DocumentLine, configuration: FinantialDocumentLineRowConfiguration) {
        if (rowIndex < 0 || !documentLine || !documentLine.values || !configuration) {
            return;
        }

        // index
        this.index = `${rowIndex}`;
        while (this.index.length < 3) {
            this.index = `0${this.index}`;
        }

        // title
        this.title = this.documentValueService.getDocumentLabelForKey(documentLine.values, configuration.titleKey, '-');

        // left value
        const leftDv = documentLine.values.find(dv => dv.key === configuration.leftValueKey);
        if (leftDv) {
            this.leftValueTitle = this.documentValueService.getDocumentValueLabelLocalized(leftDv, true);
            this.leftValue = this.documentValueService.getDocumentValueValueAsString(leftDv);
        }

        // right value
        const rightDv = documentLine.values.find(dv => dv.key === configuration.rightValueKey);
        if (rightDv) {
            this.rightValueTitle = this.documentValueService.getDocumentValueLabelLocalized(rightDv, true);
            this.rightValue = this.documentValueService.getDocumentValueValueAsString(rightDv);
        }

        // color
        const colorDv = documentLine.values.find(dv => dv.state === 1 && dv.key === 'SidebarColorState');
        if (colorDv) {
            switch (colorDv.value) {
                case 1:
                    this.colorClass = 'green-color';
                    break;
                case 2:
                    this.colorClass = 'yellow-color';
                    break;
                case 3:
                    this.colorClass = 'red-color';
                    break;
                default:
                    this.colorClass = 'default-color';
                    break;
            }
        } else {
            // default color
            this.colorClass = 'default-color';
        }
    }
}
