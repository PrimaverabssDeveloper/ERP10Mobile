import { Component, OnInit, Input, HostListener, ElementRef, ViewChild, OnDestroy } from '@angular/core';

@Component({
    selector: 'hr-monthly-charts',
    templateUrl: './monthly-charts.component.html',
    styleUrls: ['./monthly-charts.component.scss']
})

export class MonthlyChartsComponent implements OnInit, OnDestroy {

    private touchEventListeners: { [key: string]: (e: TouchEvent) => void};
    private chartsWrapperSize: {width: number, height: number };
    private yearsWrapperSize: {width: number, height: number };
    private hasDragStarted: boolean;
    private lastTouchPointX: number;
    private translationOffset: number;

    years: string[];

    @ViewChild('chartsWrapper') chartsElem: ElementRef;
    @ViewChild('yearsWrapper') yearsElem: ElementRef;

    constructor(private element: ElementRef) {
        this.years = ['2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019'];
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

        setTimeout(() => {
            this.chartsWrapperSize = {
                width: this.chartsElem.nativeElement.clientWidth,
                height: this.chartsElem.nativeElement.clientHeight
            };

            this.yearsWrapperSize = {
                width: this.yearsElem.nativeElement.clientWidth,
                height: this.yearsElem.nativeElement.clientHeight
            };
        }, 100);
    }

    ngOnDestroy(): void {

    }

    getChartsStyle(): any {
        return {
            'transform': `translateX(${this.translationOffset}px)`,
            'width': `${ this.chartsWrapperSize && this.years ? this.years.length * this.chartsWrapperSize.width : 0}px`
        };
    }

    getChartStyle(): any {
        return {
            'width': `${this.chartsWrapperSize ? this.chartsWrapperSize.width : 0}px`
        };
    }

    getYearsStyle(): any {
        return {
            'transform': `translateX(${this.translationOffset * .2}px)`,
            // 'left': `${ this.chartsWrapperSize && this.years ? - (this.years.length - 1) * this.chartsWrapperSize.width : 0}px`,
            'right': `${ this.chartsWrapperSize ? this.chartsWrapperSize.width * .5 - this.chartsWrapperSize.width * .2 * .5 : 0}px`,
            'width': `${ this.chartsWrapperSize && this.years ? this.years.length * this.chartsWrapperSize.width * .2 : 0}px`
        };
    }

    getYearStyle(yearIndex: number): any {

        const yearOffset = (this.years.length - 1 - yearIndex)  * this.chartsWrapperSize.width;
        const diff = Math.abs(yearOffset - this.translationOffset);

        if (diff < this.chartsWrapperSize.width * .5) {
            console.log(diff + '>' + yearOffset + ' > ' + ((diff / this.chartsWrapperSize.width * .2)));
            return {
                'transform': `scale(${1.3 - .3 * (diff / (this.chartsWrapperSize.width * .5))})`,
                'width': `${this.chartsWrapperSize ? this.chartsWrapperSize.width * .2 : 0}px`
            };
        } else {
            return {
                'width': `${this.chartsWrapperSize ? this.chartsWrapperSize.width * .2 : 0}px`
            };
        }
    }

    jumpToYearAction(yearIndex: number) {
        this.translationOffset = (this.years.length - 1 - yearIndex)  * this.chartsWrapperSize.width;
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
        const index = Math.round(this.translationOffset / this.chartsWrapperSize.width);
        this.translationOffset = index * this.chartsWrapperSize.width;
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
        const index = Math.round(this.translationOffset / this.chartsWrapperSize.width);
        this.translationOffset = index * this.chartsWrapperSize.width;
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
