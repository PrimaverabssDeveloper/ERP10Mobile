import { SalesChartsComponent } from './sales-charts';
import { PeriodSelectorComponent } from './period-selector/period-selector.component';
import { SalesChartComponent } from './sales-chart/sales-chart.component';
import { SalesTableComponent } from './sales-table/sales-table.component';
import { FooterTabMenuComponent } from './footer-menu';

export * from './footer-menu';
export * from './sales-charts';

export const COMPONENTS = [
    SalesChartsComponent,
    FooterTabMenuComponent,
    PeriodSelectorComponent,
    SalesChartComponent,
    SalesTableComponent
];
