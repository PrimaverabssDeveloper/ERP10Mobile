import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MoneyValue } from '../../../core/entities';

@Component({
    selector: 'finantial-document-row',
    templateUrl: './finantial-document-row.component.html',
    styleUrls: ['./finantial-document-row.component.scss']
})
export class FinantialDocumentRowComponent implements OnInit {

    _date: Date;
    _secondDate: Date;

    @Input() title: string;
    @Input() date: string | Date;
    @Input() secondDate: string | Date;
    @Input() value: MoneyValue;
    @Input() secondValue: MoneyValue;

    constructor() {
    }

    ngOnInit() {
        this.title = 'SA CENAS';
        this.date = (new Date()).toISOString();
        this.secondDate = (new Date()).toISOString();

        this.value = {
            value: 1234.33,
            currency: 'EUR'
        };

        this.secondValue = {
            value: 34.33,
            currency: 'USD'
        };
    }
}
