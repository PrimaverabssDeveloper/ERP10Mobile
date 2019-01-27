import { CompanySelectorComponent } from './company-selector/company-selector.component';
import { TotalSalesTickerComponent } from './total-sales-ticker/total-sales-ticker.component';
import { FooterTabMenuComponent } from './footer-menu';
import { MonthSelectorComponent } from './month-selector/month-selector.component';
import { SalesTableComponent } from './sales-table/sales-table.component';
import { SalesChartComponent } from './sales-chart/sales-chart.component';

export * from './total-sales-ticker/total-sales-ticker.component';
export * from './company-selector/company-selector.component';
export * from './footer-menu';
export * from './month-selector/month-selector.component';
export * from './sales-table/sales-table.component';
export * from './sales-chart/sales-chart.component';

export const COMPONENTS = [
    CompanySelectorComponent,
    TotalSalesTickerComponent,
    FooterTabMenuComponent,
    MonthSelectorComponent,
    SalesTableComponent,
    SalesChartComponent
];

export const ENTRY_COMPONENTS = [
    CompanySelectorComponent,
    TotalSalesTickerComponent,
    SalesChartComponent,
    SalesTableComponent
];
