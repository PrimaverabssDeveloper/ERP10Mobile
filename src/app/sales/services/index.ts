import { SalesService } from './sales.service';
import { Provider, FactoryProvider } from '@angular/core';
import { AuthenticationService, InstanceService, InstanceHttpRequestService, DomService, StorageService } from '../../core/services';
import { HttpClient } from '@angular/common/http';
import { SalesDemoService } from './sales.demo.service';
import { SalesStorageService } from './sales-storage.service';
import { ChartShareService } from './chart-share.service';
import { SalesSettingsService } from './sales-settings.service';

export * from './sales.service';
export * from './sales-storage.service';
export * from './chart-share.service';
export * from './sales-settings.service';

export const SERVICES = [
    SalesStorageService,
    ChartShareService,
    SalesSettingsService
];

export const SalesServiceProvider: FactoryProvider = {
    provide: SalesService,
    useFactory: (
        http: HttpClient,
        authService: AuthenticationService,
        instanceHttpRequestService: InstanceHttpRequestService,
        domService: DomService,
        storageService: SalesStorageService
    ) => {
        if (authService.isAuthenticateAsDemo) {
            return new SalesDemoService(instanceHttpRequestService, domService, storageService, http);
        } else {
            return new SalesService(instanceHttpRequestService, domService, storageService);
        }
    },
    deps: [
        HttpClient,
        AuthenticationService,
        InstanceHttpRequestService,
        DomService,
        SalesStorageService
    ],
};
