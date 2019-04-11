import { Component, OnInit, Input, HostListener, ElementRef } from '@angular/core';

@Component({
    selector: 'hr-year-selector',
    templateUrl: './year-selector.component.html',
    styleUrls: ['./year-selector.component.scss']
})

export class YearSelectorComponent implements OnInit {

    @Input() years: string[];

    hasDragStarted: boolean;
    private lastTouchPointX: number;
    private translationOffset: number;
    private componentWidth: number;

    get style(): any {
        // return {
        //     transform: `translateX(${this.translation}px)`
        // };

        return {};
    }

    constructor(private element: ElementRef) {
        this.years = ['2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019'].reverse();
        this.translationOffset = 0;
    }

    ngOnInit(): void {
        this.componentWidth = this.element.nativeElement.firstElementChild.clientWidth;
    }

    getYearStyle(index: number) {
        const yearWidth = 80;
        let translateX = 0;
        const componentWidth = this.element.nativeElement.firstElementChild.clientWidth;
        translateX = componentWidth * .5 - yearWidth * .5 - yearWidth * index + this.translationOffset;

        const gap = Math.abs(translateX - (componentWidth * .5 - yearWidth * .5));
        const scale = gap < yearWidth ? 1 + (1 - gap / yearWidth) * .2 : 1;

        return {
            width: `${yearWidth}px`,
            transform: `translateX(${translateX}px) scale(${scale})`
        };
    }

    @HostListener('touchstart', ['$event'])
    onMouseDown(e: TouchEvent) {
        this.hasDragStarted = true;
        this.lastTouchPointX = e.touches[0].clientX;
    }

    @HostListener('touchmove', ['$event'])
    onMouseMove(e: TouchEvent) {
        if (this.hasDragStarted) {
            const deltaX = e.touches[0].clientX - this.lastTouchPointX;
            this.translationOffset = this.translationOffset + deltaX > 0 ? this.translationOffset + deltaX : this.translationOffset;
            this.lastTouchPointX = e.touches[0].clientX;
        }
    }

    @HostListener('touchend', ['$event'])
    onMouseUp(e: TouchEvent) {
        this.hasDragStarted = false;
        this.lastTouchPointX = null;
        const index = Math.round(this.translationOffset / 80);
        this.translationOffset = index * 80;
    }
}
