import { SalesService } from './sales.service';
import { Provider, FactoryProvider } from '@angular/core';
import { AuthenticationService, InstanceService, InstanceHttpRequestService, DomService, StorageService } from '../../core/services';
import { HttpClient } from '@angular/common/http';
import { SalesDemoService } from './sales.demo.service';
import { SalesStorageService } from './sales-storage.service';
import { SalesSettingsService } from './sales-settings.service';

export * from './sales.service';
export * from './sales-storage.service';
export * from './sales-settings.service';


export const SalesServiceFactory = (
    http: HttpClient,
    authService: AuthenticationService,
    instanceHttpRequestService: InstanceHttpRequestService,
    domService: DomService,
    storageService: SalesStorageService,
    salesSettingsService: SalesSettingsService) => {
    if (authService.isAuthenticateAsDemo) {
        return new SalesDemoService(instanceHttpRequestService, domService, storageService, http, salesSettingsService);
    } else {
        return new SalesService(instanceHttpRequestService, domService, storageService, salesSettingsService);
    }
};


export const SalesServiceProvider: FactoryProvider = {
    provide: SalesService,
    useFactory: SalesServiceFactory,
    deps: [
        HttpClient,
        AuthenticationService,
        InstanceHttpRequestService,
        DomService,
        SalesStorageService,
        SalesSettingsService
    ],
};
