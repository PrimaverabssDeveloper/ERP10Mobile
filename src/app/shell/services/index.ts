import { Provider } from '@angular/core';
import { InstancesService } from './instances.service';
import { HttpRequestService, AuthenticationService } from '../../core/services';
import { HttpClient } from '@angular/common/http';
import { InstancesDemoService } from './instances.demo.service';

export * from './instances.service';
export * from './instances.demo.service';

export const InstanceServiceFactory = (http: HttpClient, httpRequestService: HttpRequestService, authService: AuthenticationService) => {
    if (authService.isAuthenticateAsDemo) {
            return new InstancesDemoService(httpRequestService, http);
        } else {
            return new InstancesService(httpRequestService);
        }
};

export const InstancesServiceProvider: Provider = {
    provide: InstancesService,
    useFactory: (
        http: HttpClient,
        httpRequestService: HttpRequestService,
        authService: AuthenticationService
    ) => {
        return InstanceServiceFactory(http, httpRequestService, authService);
    },
    deps: [
        HttpClient,
        HttpRequestService,
        AuthenticationService
    ]
};
