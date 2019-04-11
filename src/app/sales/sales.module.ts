import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { PAGES } from './pages';
import { SALES_ROUTING } from './sales.routes';
import { ENTRY_COMPONENTS, COMPONENTS } from './components';
import { SalesService, SalesServiceProvider, SalesStorageService, SERVICES } from './services';
import { ModulesService, AuthenticationService, InstanceHttpRequestService, DomService } from '../core/services';
import { SharedModule } from '../shared/shared.module';
import { ModuleDefinition } from '../core/entities';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { LocalizedStringsPipe, CurrencySymbolPipe, LocaleCurrencyPipe, LocaleDatePipe, CompanyKeySanitizerPipe } from '../shared/pipes';
import { SalesChartsModule } from '../sales-charts/sales-charts.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslateModule,
        SharedModule,
        SalesChartsModule,
        SALES_ROUTING
    ],
    declarations: [PAGES, COMPONENTS],
    entryComponents: [ENTRY_COMPONENTS],
    providers: [
        SERVICES,
        LocalizedStringsPipe,
        LocaleCurrencyPipe,
        CompanyKeySanitizerPipe,
        LocaleDatePipe,
        CurrencySymbolPipe,
    ]
})
export class SalesModule {
    constructor(
        private modulesService: ModulesService,
        private http: HttpClient,
        private authService: AuthenticationService,
        private instanceHttpRequestService: InstanceHttpRequestService,
        private domService: DomService,
        private storageService: SalesStorageService
    ) {

        const moduleDef: ModuleDefinition = {
            key: 'Sales',
            displayRelevance: 0,
            moduleRoutePath: '/sales',
            iconPath: '/assets/sales/sales_logo.svg',
            iconPathActive: '/assets/sales/sales_logo_pr.svg',
            localizedNameKey: 'SALES.MODULE_NAME',
            summaries: {
                hasSummaries: true,
                summariesHandler: () => {
                    const ss: SalesService = SalesServiceProvider.useFactory(
                        this.http,
                        this.authService,
                        this.instanceHttpRequestService,
                        this.domService,
                        this.storageService);

                    return ss.createSalesSummaryTickers();
                }
            },
            settings: {
                hasSettings: true,
                settingsRoutePath: '/sales/settings'
            }
        };

        this.modulesService.addModuleDefinition(moduleDef);

        // this.modulesService.addModuleSummariesHandler('sales', () => this.salesService.createSalesSummaryTickers());
    }
}
