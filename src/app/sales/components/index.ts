import { CompanySelectorComponent } from './company-selector/company-selector.component';
import { SalesTickerComponent } from './sales-ticker/sales-ticker.component';
import { FooterTabMenuComponent } from './footer-menu/footer-tab-menus.component';

export * from './sales-ticker/sales-ticker.component';
export * from './company-selector/company-selector.component';
export * from './footer-menu/footer-tab-menus.component';

export const COMPONENTS = [
    CompanySelectorComponent,
    SalesTickerComponent,
    FooterTabMenuComponent
];

export const ENTRY_COMPONENTS = [
    CompanySelectorComponent,
    SalesTickerComponent
];
