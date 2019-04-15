import { Component, Input, Output, EventEmitter, HostListener, OnInit } from '@angular/core';

@Component({
    selector: 'period-selector',
    templateUrl: './period-selector.component.html',
    styleUrls: ['./period-selector.component.scss']
})
export class PeriodSelectorComponent implements OnInit {

    private _periods: PeriodData[];

    // #region 'Properties'

    /**
     * Defines the current period selected.
     *
     * @type {PeriodData}
     * @memberof PeriodSelectorComponent
     */
    currentPeriodSelected: PeriodData;

    /**
     * Defines if the user is currently touching the month selector.
     *
     * @type {boolean}
     * @memberof PeriodSelectorComponent
     */
    isTouchDown: boolean;

    /**
     * Defines the magnified selected month div style.
     *
     * @type {{ left: string }}
     * @memberof PeriodSelectorComponent
     */
    magnifiedSelectedPeriodStyle: { left: string, width: string };

    /**
     * The periods to be selected;
     *
     * @type {{ period: string, label: string} []}
     * @memberof PeriodSelectorComponent
     */
    @Input() set periods(value: PeriodData [] ) {
        if (value && (!this._periods || this._periods.length !== value.length)) {
            this._periods = value;
            this.currentPeriodSelected = value[0];
        }
    }

    get periods(): PeriodData [] {
        return this._periods;
    }

    /**
     * Event to emit the change of a selected period.
     *
     * @memberof PeriodSelectorComponent
     */
    @Output() periodSelected = new EventEmitter<PeriodData>();
    // #endregion

    // #region 'Constructor'

    constructor() {
    }

    // #endregion

    // #region 'Methods'

    /**
    * Execute on page initialization.
    *
    * @memberof PeriodSelectorComponent
    */
    async ngOnInit() {
    }


    @HostListener('touchstart', ['$event'])
    onTouchStart(e: TouchEvent) {

        const target = e.target as any;
        this.updatePeriodSelectionForTarget(target);
        this.isTouchDown = true;
    }

    @HostListener('touchend', ['$event'])
    onTouchEnd(e: TouchEvent) {
        this.isTouchDown = false;
    }

    getPeriodStyle(): any {
        return {
            width: `calc(100%/${this.periods.length})`
        };
    }

    private updatePeriodSelectionForTarget(target: any) {

        if (target.className !== 'period')  {
            return;
        }

        const period = this.periods.find(p => p.label === target.innerText);
        if (period) {
            this.currentPeriodSelected = period;

            const magLeft = target.offsetLeft - 26 * .5; // + target.offsetWidth * .5 - 25; // 25 => 50*.5 => half the size of magnifier
            this.magnifiedSelectedPeriodStyle = {
                left: `${magLeft}px`,
                width: `${target.offsetWidth + 26}px`
            };

            this.periodSelected.emit(this.currentPeriodSelected);
        }
    }

    // #endregion
}

export interface PeriodData {
    period: string;
    label: string;
    context: string;
}
