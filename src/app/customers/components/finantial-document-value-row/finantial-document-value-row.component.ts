import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MoneyValue, LocalizedString } from '../../../core/entities';
import { DocumentValue, DocumentValueType } from '../../entities';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { LocaleService } from '../../../core/services';
import { DocumentValueService } from '../../services';

@Component({
    selector: 'finantial-document-value-row',
    templateUrl: './finantial-document-value-row.component.html',
    styleUrls: ['./finantial-document-value-row.component.scss'],
    providers: [CurrencyPipe, DatePipe]
})
export class FinantialDocumentValueRowComponent {

    label: string;
    value: string;
    color: string;

    @Input() set documentValue(value: DocumentValue) {
        this.label = this.documentValueService.getDocumentValueLabelLocalized(value);
        this.value = this.documentValueService.getDocumentValueValueAsString(value);
    }

    @Input() set colorIndex(colorIndex: number) {
        switch (colorIndex) {
            case 1:
                this.color = '#65B365'; // green
                break;
            case 2:
                this.color = '#FFED03'; // yellow
                break;
            case 3:
                this.color = '#CC3939'; // red
                break;
            default:
                this.color = 'rgb(213, 213, 213)'; // gray
                break;
        }
    }

    get style(): any {

        const color = this.color ? this.color : 'transparent';

        return {
            'background': `${color}`
        };
    }

    constructor(
        private documentValueService: DocumentValueService,
        ) { }
}
