import { SalaryChartComponent } from './salary-chart/salary-chart.component';
import { YearSelectorComponent } from './year-selector/year-selector.component';
import { MonthlyChartsComponent } from './monthly-charts/monthly-charts.component';
import { ChartVerticalAxisComponent } from './chart-vertical-axis/chart-vertical-axis.component';
import { YearlyChartComponent } from './yearly-chart/yearly-chart.component';
import { DocumentsListComponent } from './documents-list/documents-list.component';

import { AddPinComponent } from './pin-dialog/add-pin.component';
import { RemovePinComponent } from './pin-dialog/remove-pin.component';
import { VerifyPinComponent } from './pin-dialog/verify-pin.component';

export * from './salary-chart/salary-chart.component';
export * from './year-selector/year-selector.component';
export * from './yearly-chart/yearly-chart.component';
export * from './monthly-charts/monthly-charts.component';
export * from './chart-vertical-axis/chart-vertical-axis.component';
export * from './documents-list/documents-list.component';
export * from './pin-dialog/pin.component.base';
export *  from './pin-dialog/add-pin.component';
export *  from './pin-dialog/verify-pin.component';

export const COMPONENTS = [
    SalaryChartComponent,
    YearSelectorComponent,
    YearlyChartComponent,
    MonthlyChartsComponent,
    ChartVerticalAxisComponent,
    DocumentsListComponent,
    AddPinComponent,
    VerifyPinComponent,
    RemovePinComponent
];

export const ENTRY_COMPONENTS = [
    DocumentsListComponent,
    AddPinComponent,
    VerifyPinComponent,
    RemovePinComponent
];
