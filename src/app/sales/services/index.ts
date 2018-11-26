import { SalesService } from './sales.service';
import { Provider } from '@angular/core';
import { AuthenticationService, InstancesService, InstanceHttpRequestService, DomService } from '../../core/services';
import { HttpClient } from '@angular/common/http';
import { SalesDemoService } from './sales.demo.service';

export * from './sales.service';

export const SERVICES = [
];

export const SalesServiceProvider: Provider = {
    provide: SalesService,
    useFactory: (
        http: HttpClient,
        authService: AuthenticationService,
        instanceHttpRequestService: InstanceHttpRequestService,
        domService: DomService
    ) => {
        if (authService.isAuthenticateAsDemo) {
            return new SalesDemoService(instanceHttpRequestService, domService, http);
        } else {
            return new SalesService(instanceHttpRequestService, domService);
        }
    },
    deps: [
        HttpClient,
        AuthenticationService,
        InstanceHttpRequestService,
        DomService],
};
