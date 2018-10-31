import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { ModuleSummary } from '../../entities';
import { Slides } from '@ionic/angular';


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
    @Input() tickers: HTMLElement[];

    @ViewChild('slide') slide: Slides;

    constructor() {

    }

    /**
    * Execute on page initialization.
    *
    * @memberof TickersComponent
    */
    ngOnInit(): void {
        if (this.slide) {
            setTimeout(() => {
                this.slide.update();
            }, 1000);
        }
    }
}
