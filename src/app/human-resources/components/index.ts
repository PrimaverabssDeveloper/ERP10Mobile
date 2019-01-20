import { SalaryChartComponent } from './salary-chart/salary-chart.component';
import { YearSelectorComponent } from './year-selector/year-selector.component';
import { MonthlyChartsComponent } from './monthly-charts/monthly-charts.component';
import { ChartVerticalAxisComponent } from './chart-vertical-axis/chart-vertical-axis.component';
import { YearlyChartComponent } from './yearly-chart/yearly-chart.component';

export * from './salary-chart/salary-chart.component';
export * from './year-selector/year-selector.component';
export * from './yearly-chart/yearly-chart.component';
export * from './monthly-charts/monthly-charts.component';
export * from './chart-vertical-axis/chart-vertical-axis.component';

export const COMPONENTS = [
    SalaryChartComponent,
    YearSelectorComponent,
    YearlyChartComponent,
    MonthlyChartsComponent,
    ChartVerticalAxisComponent
];
