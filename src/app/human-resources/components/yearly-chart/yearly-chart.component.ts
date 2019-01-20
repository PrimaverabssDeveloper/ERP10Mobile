import { Component, OnInit, Input, HostListener, ElementRef, ViewChild, OnDestroy, EventEmitter, Output } from '@angular/core';
import { YearSalary, MonthSalary } from '../../models';
import { SalaryChartDataColumn, SalaryChartData, SalaryChartVerticalAxis } from '../salary-chart/salary-chart.component';

@Component({
    selector: 'hr-yearly-chart',
    templateUrl: './yearly-chart.component.html',
    styleUrls: ['./yearly-chart.component.scss']
})

export class YearlyChartComponent implements OnInit, OnDestroy {

    // get currentChartVerticalAxisData(): SalaryChartVerticalAxis {
    //     return this.currentYear ? this.currentYear.monthsChartData.verticalAxisData : null;
    // }

    @Input() data: SalaryChartData;

    @Output() selected = new EventEmitter();

    constructor() {

    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {

    }

    onSelectedYearChange(yearColumnData: SalaryChartDataColumn) {
        this.selected.emit(yearColumnData);
    }
}
