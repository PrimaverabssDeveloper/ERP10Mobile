import { Component, OnInit, Input, HostListener, ElementRef, ViewChild, OnDestroy, EventEmitter, Output } from '@angular/core';
import { YearSalary, MonthSalary } from '../../models';
import { SalaryChartDataColumn, SalaryChartData, SalaryChartVerticalAxis } from '../salary-chart/salary-chart.component';

@Component({
    selector: 'hr-monthly-charts',
    templateUrl: './monthly-charts.component.html',
    styleUrls: ['./monthly-charts.component.scss']
})

export class MonthlyChartsComponent implements OnInit, OnDestroy {

    private touchEventListeners: { [key: string]: (e: TouchEvent) => void};
    private chartsWrapperSize: { getWidth: () => number, getHeight: () => number };
    private yearsWrapperSize: { getWidth: () => number, getHeight: () => number };
    private hasDragStarted: boolean;
    private lastTouchPointX: number;
    private translationOffset: number;

    private currentYear: {
        year: number,
        monthsChartData: SalaryChartData
    };

    years: string[];

    monthsData: {
        year: number,
        monthsChartData: SalaryChartData
    }[];

    get currentChartVerticalAxisData(): SalaryChartVerticalAxis {
        return this.currentYear ? this.currentYear.monthsChartData.verticalAxisData : null;
    }

    @ViewChild('chartsWrapper') chartsElem: ElementRef;
    @ViewChild('yearsWrapper') yearsElem: ElementRef;

    @Input() set data(data: {
        year: number,
        monthsChartData: SalaryChartData
    }[]) {
        if (data) {
            this.monthsData = data;
            this.currentYear = data[data.length - 1];
            // this.currentChartVerticalAxisData = this.currentYear.monthsChartData.verticalAxisData;
            this.buildYears();
        }
    }

    @Output() selected = new EventEmitter();

    constructor(private element: ElementRef) {
        this.translationOffset = 0;
    }

    ngOnInit(): void {

        this.touchEventListeners = {
            'onChartsTouchStart' :  (e) => { this.onChartsTouchStart(e); },
            'onChartsTouchMove' :  (e) => { this.onChartsTouchMove(e); },
            'onChartsTouchEnd' :  (e) => { this.onChartsTouchEnd(e); },
            'onYearsTouchStart' :  (e) => { this.onYearsTouchStart(e); },
            'onYearsTouchMove' :  (e) => { this.onYearsTouchMove(e); },
            'onYearsTouchEnd' :  (e) => { this.onYearsTouchEnd(e); }
        };


        this.chartsElem.nativeElement.addEventListener('touchstart', this.touchEventListeners['onChartsTouchStart']);
        this.chartsElem.nativeElement.addEventListener('touchmove', this.touchEventListeners['onChartsTouchMove']);
        this.chartsElem.nativeElement.addEventListener('touchend', this.touchEventListeners['onChartsTouchEnd']);

        this.yearsElem.nativeElement.addEventListener('touchstart', this.touchEventListeners['onYearsTouchStart']);
        this.yearsElem.nativeElement.addEventListener('touchmove', this.touchEventListeners['onYearsTouchMove']);
        this.yearsElem.nativeElement.addEventListener('touchend', this.touchEventListeners['onYearsTouchEnd']);

        // setTimeout(() => {

        // }, 500);

        this.chartsWrapperSize = {
            getWidth: () => this.chartsElem.nativeElement.clientWidth,
            getHeight: () => this.chartsElem.nativeElement.clientHeight
        };

        this.yearsWrapperSize = {
            getWidth: () => this.yearsElem.nativeElement.clientWidth,
            getHeight: () => this.yearsElem.nativeElement.clientHeight
        };
    }

    ngOnDestroy(): void {

    }

    onSelectedMonthSalaryChange(monthSalary: MonthSalary) {
        this.selected.emit(monthSalary);
    }

    getChartsStyle(): any {
        return {
            'transform': `translateX(${this.translationOffset}px)`,
            'width': `${ this.chartsWrapperSize && this.years ? this.years.length * this.chartsWrapperSize.getWidth() : 0}px`
        };
    }

    getChartStyle(): any {
        return {
            'width': `${this.chartsWrapperSize ? this.chartsWrapperSize.getWidth() : 0}px`
        };
    }

    getYearsStyle(): any {
        const chartsWrapperSizeWidth = this.chartsWrapperSize.getWidth();

        return {
            'transform': `translateX(${this.translationOffset * .2}px)`,
            // 'left': `${ this.chartsWrapperSize && this.years ? - (this.years.length - 1) * this.chartsWrapperSize.width : 0}px`,
            'right': `${ this.chartsWrapperSize ? chartsWrapperSizeWidth * .5 - chartsWrapperSizeWidth * .2 * .5 : 0}px`,
            'width': `${ this.chartsWrapperSize && this.years ? this.years.length * chartsWrapperSizeWidth * .2 : 0}px`
        };
    }

    getYearStyle(yearIndex: number): any {

        const yearOffset = (this.years.length - 1 - yearIndex)  * this.chartsWrapperSize.getWidth();
        const diff = Math.abs(yearOffset - this.translationOffset);

        const chartsWrapperSizeWidth = this.chartsWrapperSize.getWidth();

        if (diff < chartsWrapperSizeWidth * .5) {
            return {
                'opacity': `${1 - .5 * (diff / (chartsWrapperSizeWidth * .5))}`,
                'transform': `scale(${1.3 - .3 * (diff / (chartsWrapperSizeWidth * .5))})`,
                'width': `${this.chartsWrapperSize ? chartsWrapperSizeWidth * .2 : 0}px`
            };
        } else {
            return {
                'opacity': '.5',
                'width': `${this.chartsWrapperSize ? chartsWrapperSizeWidth * .2 : 0}px`
            };
        }
    }

    jumpToYearAction(yearIndex: number) {
        this.translationOffset = (this.years.length - 1 - yearIndex)  * this.chartsWrapperSize.getWidth();
        this.currentYear = this.monthsData[yearIndex];
    }

    onChartsTouchStart(e: TouchEvent) {
        this.hasDragStarted = true;
        this.lastTouchPointX = e.touches[0].clientX;
    }

    onChartsTouchMove(e: TouchEvent) {
        if (this.hasDragStarted) {
            const deltaX = e.touches[0].clientX - this.lastTouchPointX;
            this.translationOffset = this.translationOffset + deltaX > 0 ? this.translationOffset + deltaX : this.translationOffset;
            this.lastTouchPointX = e.touches[0].clientX;
        }
    }

    onChartsTouchEnd(e: TouchEvent) {
        this.hasDragStarted = false;
        this.lastTouchPointX = null;
        let yearIndex = Math.round(this.translationOffset / this.chartsWrapperSize.getWidth());

        // verify is it has scrolled more than it was suposed
        if (yearIndex >= this.monthsData.length) {
            yearIndex = this.monthsData.length - 1;
        }

        this.translationOffset = yearIndex * this.chartsWrapperSize.getWidth();
        this.currentYear = this.monthsData[yearIndex];
    }

    onYearsTouchStart(e: TouchEvent) {
        this.hasDragStarted = true;
        this.lastTouchPointX = e.touches[0].clientX;
    }

    onYearsTouchMove(e: TouchEvent) {
        if (this.hasDragStarted) {
            const deltaX = (e.touches[0].clientX - this.lastTouchPointX) * 5;
            this.translationOffset = this.translationOffset + deltaX > 0 ? this.translationOffset + deltaX : this.translationOffset;
            this.lastTouchPointX = e.touches[0].clientX;
        }
    }

    onYearsTouchEnd(e: TouchEvent) {
        this.hasDragStarted = false;
        this.lastTouchPointX = null;
        const index = Math.round(this.translationOffset / this.chartsWrapperSize.getWidth());
        this.translationOffset = index * this.chartsWrapperSize.getWidth();
    }

    private buildYears() {
        this.years = this.monthsData.map(m => `${m.year}`);
    }

    // @HostListener('touchmove', ['$event'])
    // onMouseMove(e: TouchEvent) {
    //     if (this.hasDragStarted) {
    //         const deltaX = e.touches[0].clientX - this.lastTouchPointX;
    //         this.translationOffset = this.translationOffset + deltaX > 0 ? this.translationOffset + deltaX : this.translationOffset;
    //         this.lastTouchPointX = e.touches[0].clientX;
    //     }
    // }

    // @HostListener('touchend', ['$event'])
    // onMouseUp(e: TouchEvent) {
    //     this.hasDragStarted = false;
    //     this.lastTouchPointX = null;
    //     const index = Math.round(this.translationOffset / 80);
    //     this.translationOffset = index * 80;
    // }
}
