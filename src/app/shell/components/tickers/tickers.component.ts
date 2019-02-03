import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { ModuleSummary } from '../../entities';
import { Slides } from '@ionic/angular';
import { Ticker } from '../../../core/entities';


/**
 * This component is the slider that shows the summaries for the modules that have summary data.
 *
 * @export
 * @class TickersComponent
 */
@Component({
    selector: 'tickers',
    templateUrl: './tickers.component.html',
    styleUrls: ['./tickers.component.scss']
})
export class TickersComponent implements OnInit {
    get totalTickers(): number {
        return this.tickers ? this.tickers.length : 0;
    }

    currentTickerIndex: number;

    @Input() tickers: Ticker[];

    @ViewChild('slide') slide: Slides;

    constructor() {

    }

    /**
    * Execute on page initialization.
    *
    * @memberof TickersComponent
    */
    ngOnInit(): void {
        this.currentTickerIndex = 1;

        if (this.slide) {
            setTimeout(() => {
                this.slide.update();
            }, 1000);
        } else {
            return;
        }

        this.slide
            .ionSlideDidChange
            .subscribe(() => {
                this.slide
                    .getActiveIndex()
                    .then((res) => {
                        this.currentTickerIndex = res + 1;
                    });
            });
    }
}
