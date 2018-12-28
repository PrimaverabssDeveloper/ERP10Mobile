import { SalesService } from './sales.service';
import { Provider } from '@angular/core';
import { AuthenticationService, InstancesService, InstanceHttpRequestService, DomService, StorageService } from '../../core/services';
import { HttpClient } from '@angular/common/http';
import { SalesDemoService } from './sales.demo.service';
import { SalesStorageService } from './sales-storage.service';

export * from './sales.service';
export * from './sales-storage.service';

export const SERVICES = [
];

export const SalesServiceProvider: Provider = {
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
