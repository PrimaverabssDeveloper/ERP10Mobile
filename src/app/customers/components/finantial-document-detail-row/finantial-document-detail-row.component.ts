import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MoneyValue } from '../../../core/entities';

@Component({
    selector: 'finantial-document-detail-row',
    templateUrl: './finantial-document-detail-row.component.html',
    styleUrls: ['./finantial-document-detail-row.component.scss']
})
export class FinantialDocumentDetailRowComponent {

    @Input() label: string;
    @Input() value: string;
    @Input() color: string;

    get style(): any {

        const color = this.color ? this.color : 'transparent';

        return {
            'background': `${color}`
        };
    }

    constructor() {
    }
}
