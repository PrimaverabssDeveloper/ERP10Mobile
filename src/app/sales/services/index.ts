import { SalesService } from './sales.service';
import { Provider, FactoryProvider } from '@angular/core';
import { AuthenticationService, InstanceService, InstanceHttpRequestService, DomService, StorageService } from '../../core/services';
import { HttpClient } from '@angular/common/http';
import { SalesDemoService } from './sales.demo.service';
import { SalesStorageService } from './sales-storage.service';
import { ChartShareService } from './chart-share.service';

export * from './sales.service';
export * from './sales-storage.service';
export * from './chart-share.service';

export const SERVICES = [
    ChartShareService
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
        console.log('====>' + authService.isAuthenticateAsDemo);
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
