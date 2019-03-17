import { Component, Input, Output, EventEmitter, HostListener, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'month-selector',
    templateUrl: './month-selector.component.html',
    styleUrls: ['./month-selector.component.scss']
})
export class MonthSelectorComponent implements OnInit {

    // #region 'Properties'

    /**
     * Defines the current month selected.
     *
     * @type {number}
     * @memberof MonthSelectorComponent
     */
    currentMonthSelected: number;

    /**
     * Collection with all months names.
     *
     * @type {string[]}
     * @memberof MonthSelectorComponent
     */
    months: string[];

    /**
     * Defines if the user is currently touching the month selector.
     *
     * @type {boolean}
     * @memberof MonthSelectorComponent
     */
    isTouchDown: boolean;

    /**
     * Defines the magnified selected month div style.
     *
     * @type {{ left: string }}
     * @memberof MonthSelectorComponent
     */
    magnifiedSelectedMonthStyle: { left: string };

    /**
     * Event to emit the change of a selected month.
     *
     * @memberof MonthSelectorComponent
     */
    @Output() monthSelected = new EventEmitter<string>();
    // #endregion

    // #region 'Constructor'

    constructor(private translateService: TranslateService) {
        this.currentMonthSelected = 1;
        this.months = [];
    }

    // #endregion

    // #region 'Methods'

    /**
    * Execute on page initialization.
    *
    * @memberof MonthSelectorComponent
    */
    async ngOnInit() {

        for (let monthIndex = 1; monthIndex <= 12; monthIndex++) {
            const month: string = await this.translateService.get(`SHARED.DATES.MONTHS.${monthIndex}`).toPromise();
            if (month) {
                this.months.push(month.slice(0, 3).toLocaleLowerCase());
            }
        }
    }


    @HostListener('touchstart', ['$event'])
    onTouchStart(e: TouchEvent) {

        const target = e.target as any;
        this.updateMonthSelectionForTarget(target);
        this.isTouchDown = true;
    }

    @HostListener('touchend', ['$event'])
    onTouchEnd(e: TouchEvent) {
        this.isTouchDown = false;
    }

    private updateMonthSelectionForTarget(target: any) {

        if (target.className !== 'month')  {
            return;
        }

        const monthIndex = this.months.indexOf(target.innerText) + 1;
        if (monthIndex > 0 && this.currentMonthSelected !== monthIndex) {
            this.currentMonthSelected = monthIndex;

            const magLeft = target.offsetLeft + target.offsetWidth * .5 - 25; // 25 => 50*.5 => half the size of magnifier
            this.magnifiedSelectedMonthStyle = {
                left: `${magLeft}px`
            };

            this.monthSelected.emit(`${this.currentMonthSelected}`);
        }
    }

    // #endregion
}
