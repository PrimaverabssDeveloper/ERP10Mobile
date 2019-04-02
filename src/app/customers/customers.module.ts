import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { PAGES } from './pages';
import { CUSTOMERS_ROUTING } from './customers.routes';
import { MODULE_SERVICES } from './services';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { COMPONENTS } from './components';
import { PIPES } from './pipes';
import { ModulesService } from '../core/services';
import { ModuleDefinition } from '../core/entities';
import { SalesChartsModule } from '../sales-charts/sales-charts.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslateModule,
        SharedModule,
        SalesChartsModule,
        CUSTOMERS_ROUTING
    ],
    declarations: [PAGES, COMPONENTS, PIPES],
    entryComponents: [],
    providers: [
        MODULE_SERVICES,
        DatePipe,
        CurrencyPipe
    ]
})
export class CustomersModule {
    constructor(
        private modulesService: ModulesService,
    ) {
        const moduleDef: ModuleDefinition = {
            key: 'Customers',
            displayRelevance: 2,
            moduleRoutePath: '/customers',
            iconPath: '/assets/customers/customers_logo.svg',
            iconPathActive: '/assets/customers/customers_logo_pr.svg',
            localizedNameKey: 'CUSTOMERS.MODULE_NAME',
            summaries: {
                hasSummaries: false
            },
            settings: {
                hasSettings: false
            }
        };

        this.modulesService.addModuleDefinition(moduleDef);
    }
}
