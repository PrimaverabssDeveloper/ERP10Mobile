import { Component, Input, ElementRef, OnInit } from '@angular/core';
import { Ticker } from '../../../core/entities';

@Component({
    selector: 'ticker-wrapper',
    templateUrl: './ticker-wrapper.component.html',
    styleUrls: ['./ticker-wrapper.component.scss'],
})
export class TickerWrapperComponent implements OnInit {

    @Input() ticker: Ticker;

    constructor(private el: ElementRef) {

    }

    /**
    * Execute on page initialization.
    *
    * @memberof TickerWrapperComponent
    */
    ngOnInit(): void {
        this.el.nativeElement.firstChild.appendChild(this.ticker.content);
    }
}
