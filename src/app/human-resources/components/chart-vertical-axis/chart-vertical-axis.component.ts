import { Component, OnInit, Input } from '@angular/core';
import { SalaryChartVerticalAxis } from '../salary-chart/salary-chart.component';

@Component({
    selector: 'hr-chart-vertical-axis',
    templateUrl: './chart-vertical-axis.component.html',
    styleUrls: ['./chart-vertical-axis.component.scss']
})

export class ChartVerticalAxisComponent implements OnInit {

    private salaryChartVerticalAxisData: SalaryChartVerticalAxis;

    scaleStep: number;
    scaleUnitPrefix: string;
    currency: string;
    isScaleVisible: boolean;


    @Input() set data(value: SalaryChartVerticalAxis) {

        // only update the data when the data has trulie changed
        if (value && this.salaryChartVerticalAxisData !== value) {
            this.salaryChartVerticalAxisData = value;
            this.updateData(value);
            console.log('yy update');
        }
    }

    /**
    * Execute on page initialization.
    *
    * @memberof ChartVerticalAxisComponent
    */
    ngOnInit(): void {

    }

    scaleValue(scaleStep: number, step: number): string | number {
        let scale = scaleStep * (step + 1);
        // to round to 1 decimal place
        scale = Math.round(scale * 10) / 10;

        // if its not a number, returns an empty string
        return isNaN(scale) ? '' : scale ;
    }

    private updateData(data: SalaryChartVerticalAxis) {

        // use setTimeout's to ensure that the ui is immediately updated
        setTimeout(() => {
            this.scaleStep = data.scaleStep;
            this.scaleUnitPrefix = data.scaleUnitPrefix;
            this.currency = data.currency;
            this.isScaleVisible = false;
        }, 0);

        setTimeout(() => this.isScaleVisible = true, 100);
    }
}
