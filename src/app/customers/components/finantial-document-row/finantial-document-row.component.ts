import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MoneyValue } from '../../../core/entities';

@Component({
    selector: 'finantial-document-row',
    templateUrl: './finantial-document-row.component.html',
    styleUrls: ['./finantial-document-row.component.scss']
})
export class FinantialDocumentRowComponent {

    @Input() title: string;
    @Input() date: string | Date;
    @Input() secondDate: string | Date;
    @Input() value: MoneyValue;
    @Input() secondValue: MoneyValue;
    @Input() accentColor?: string;
}
